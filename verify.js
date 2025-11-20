const { authenticator } = require('otplib');
const qrcode = require('qrcode');

// 1. Generate a Secret
const secret = authenticator.generateSecret(); 
// RESULT: 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD'

// 2. Save 'secret' to your User Database (Pseudocode)
// await db.users.update({ id: userId }, { twoFactorSecret: secret });

// 3. Generate the URI for the QR Code
const user = 'user@example.com';
const service = 'MyCoolApp';
const otpauth = authenticator.keyuri(user, service, secret);

// 4. Generate QR Code Image Data URL (to send to frontend)
qrcode.toDataURL(otpauth, (err, imageUrl) => {
  if (err) {
    console.log('Error generating QR');
    return;
  }
  // Send 'imageUrl' to the frontend to display in an <img src="..."> tag
  console.log(imageUrl); 
});