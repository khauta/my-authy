const express = require('express');
const path = require('path');
const { authenticator } = require('otplib');
const qrcode = require('qrcode');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

let secret; // In-memory demo only!

// Route to generate QR code and secret
app.get('/setup', async (req, res) => {
  secret = authenticator.generateSecret();
  const user = 'user@example.com';
  const service = 'MyAuthyApp';
  const otpauth = authenticator.keyuri(user, service, secret);
  try {
    const imageUrl = await qrcode.toDataURL(otpauth);
    res.json({ qrUrl: imageUrl, secret });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate QR' });
  }
});

// Route to verify OTP token
app.post('/verify', (req, res) => {
  const { token } = req.body;
  if (!secret) return res.status(400).json({ valid: false, message: 'No secret set' });
  const isValid = authenticator.verify({ token, secret });
  res.json({ valid: isValid });
});

// Default: serve index.html UI
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});