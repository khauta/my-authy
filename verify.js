const { authenticator } = require('otplib');
const qrcode = require('qrcode');
const { Jimp } = require('jimp');
const QrCode = require('qrcode-reader');
const qrcodeTerminal = require('qrcode-terminal');

// 1. Generate a Secret
const secret = authenticator.generateSecret();
// Save 'secret' to your User Database (Pseudocode)
// await db.users.update({ id: userId }, { twoFactorSecret: secret });

// 2. Generate the URI for the QR Code
const user = 'user@example.com';
const service = 'MyCoolApp';
const otpauth = authenticator.keyuri(user, service, secret);

// 3. Generate QR Code Image Data URL (to send to frontend)
qrcode.toDataURL(otpauth, (err, imageUrl) => {
  if (err) {
    console.error('Error generating QR:', err);
    return;
  }

  // Output the Data URL (useful for frontend display)
  console.log('QR Data URL (use in frontend <img src="...">):');
  console.log(imageUrl);

  // 4. Decode and render the same QR to the terminal
  // Remove the data URI prefix if present
  const base64Data = imageUrl.replace(/^data:image\/[a-z]+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');

  // Use Jimp to read the PNG buffer and qrcode-reader to decode the QR
  // `Jimp.read` may be a promise-based API depending on the installed version,
  // and some Jimp builds export as `default` under require interop. We normalized
  // the import above, so use the promise API here.
  Jimp.read(buffer)
    .then((image) => {
      const qr = new QrCode();
      qr.callback = (decodeErr, value) => {
        if (decodeErr) {
          console.error('Error decoding QR:', decodeErr);
          return;
        }

        console.log('\n✅ QR Code Content:', value && value.result ? value.result : value);
        console.log('👇 Terminal Render:\n');

        // Re-render the decoded content to the terminal (compact, scannable)
        qrcodeTerminal.generate(value.result || value, { small: true });
      };

      // Pass the image bitmap to the decoder
      try {
        qr.decode(image.bitmap);
      } catch (decodeThrow) {
        console.error('Exception while decoding QR image:', decodeThrow);
      }
    })
    .catch((jimpErr) => {
      console.error('Error processing image with Jimp:', jimpErr);
    });
});