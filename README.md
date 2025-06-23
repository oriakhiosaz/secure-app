# SECURE OTP VAULT

A modern, privacy-first TOTP (Time-based One-Time Password) authenticator app.

## What is SECURE OTP VAULT?

**SECURE OTP VAULT** is a security-focused authenticator app that empowers you to manage your one-time password (OTP) secrets with confidence and privacy. It allows you to:

- **Add TOTP accounts** by scanning QR codes (otpauth:// URIs) or entering secrets manually.
- **Retain full control over your OTP secrets**—your credentials are never transmitted or exposed to third parties.
- **View a list of all your accounts** with rotating 6-digit codes, just like Google Authenticator.
- **Copy, remove, or view secrets** for backup or migration.
- **Designed for maximum privacy and security.**

## Features

- Scan QR codes from third-party services to add TOTP accounts
- Manual entry for label, secret, and issuer
- Rotating TOTP codes for each account (updates every 30 seconds)
- All secrets are stored securely and only accessible to you
- Settings page to view/copy secrets and manage accounts
- Modern UI with Tailwind CSS

## Security Principles

- **Your secrets remain private and under your control at all times.**
- **No cloud storage or external transmission of secrets.**
- **No tracking, analytics, or data sharing.**
- **You are responsible for safeguarding your backup and device.**

## Getting Started

1. Clone the repo and install dependencies:
   ```sh
   npm install
   ```
2. Run the development server:
   ```sh
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Security Notice
- **Never share your TOTP secrets.**
- This app is for personal use. For enterprise or multi-device sync, consider a dedicated password manager or authenticator with advanced security features.

---

Made with ❤️ for privacy and security.
