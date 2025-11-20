# My Authy

A simple One-Time Password (OTP) two-factor authentication (2FA) demo using [otplib](https://www.npmjs.com/package/otplib) and ExpressJS. This repository allows you to generate a temporary secret for any user, provide a QR code to link with an authenticator app (such as Google Authenticator or Authy), and verify the generated tokens from the client's device.

---

## Features

- **QR Code Generation:** Easily generate a QR code from a TOTP key URI for users to scan with their authenticator app.
- **Token Verification:** Securely verify tokens generated in an authenticator app against the server-stored secret.
- **Minimal UI:** Browser UI for setup and verification (served from `/public/index.html`), making setup and testing simple.
- **ExpressJS API:** RESTful routes (`/setup`, `/verify`) to facilitate integration or extension.

---

## Project Structure

- `index.js` - Main server using ExpressJS. Hosts static files, API endpoints for setup & verification, and integrates the authentication logic.
- `public/index.html` - Simple user interface for local setup and token verification (static, served by Express).
- `verify.js` - Standalone script for demonstrating authentication logic (now replaced by integrated approach in `index.js`).
- `package.json`/`package-lock.json` - Dependency management files.

---

## Developer Guide

### Prerequisites

- [Node.js](https://nodejs.org/) (version 12 or higher recommended)
- [npm](https://www.npmjs.com/)

### Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/khauta/my-authy.git
   cd my-authy
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Run the server:**

   ```sh
   node index.js
   ```

   By default, the app will be available at [http://localhost:3000/](http://localhost:3000/)

4. **Using the Demo UI:**
   - In your browser, navigate to [http://localhost:3000/](http://localhost:3000/).
   - Click "Setup Authenticator" to generate a new secret and corresponding QR code.
   - Scan the QR code with your authenticator app.
   - Enter the rolling 6-digit token into the input and click "Verify" to check its validity.

### Environment & Key Management

- The demo stores the generated secret in memory—**this is NOT production safe**. A real-world implementation should persist the secret to a user database.
- You can adapt the `/setup` and `/verify` endpoints to fit a production workflow with proper user identification and data storage.

### Extending/Customizing

- To support user accounts, update the `/setup` and `/verify` routes to tie secrets/tokens to unique user records.
- Replace the static user and service names as needed.
- Feel free to update the frontend for improved UX or integrate with your own authentication system.

---

## Main Function/Logic Overview

- **TOTP Secret Creation:** On visiting `/setup`, a new TOTP secret is generated per session.
- **KeyURI Encoding:** That secret is formatted as a URI for use with TOTP-compatible apps.
- **QR Code Creation:** The URI is transformed into a QR code to be scanned by clients.
- **Token Validation:** When receiving a token from the user's app (via `/verify`), it's checked against the server's stored secret.
- **UI & Workflow:** The demo interface allows you to visually test the setup and authentication logic end-to-end.

---

## Dependencies

- [`express`](https://www.npmjs.com/package/express) - Web framework for Node.js.
- [`otplib`](https://www.npmjs.com/package/otplib) - Time-based One-Time Password utilities.
- [`qrcode`](https://www.npmjs.com/package/qrcode) - QR code generator.

---

## License

MIT

---