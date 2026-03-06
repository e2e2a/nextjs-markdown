# SOP: Generating Gmail App Password for Nodemailer

This guide covers the minimal steps to obtain an `EMAIL_PASS` for use with `nodemailer` using a Gmail account.

## Prerequisites

- A Google Account with **2-Step Verification** enabled. (Google no longer supports "Less Secure Apps").

## Step-by-Step Instructions

1. **Access Security Settings**
   - Go to [myaccount.google.com/security](https://myaccount.google.com/security).
   - Ensure **2-Step Verification** is set to **On**.

2. **Generate App Password**
   - Scroll down to "How you sign in to Google" or search for **"App passwords"** in the top search bar.
   - Enter a name for the app (e.g., `Nodemailer_NextJS_Prod`).
   - Click **Create**.

3. **Capture the Secret**
   - A modal will appear with a **16-character code** (e.g., `abcd efgh ijkl mnop`).
   - **Copy this code.** This is your `EMAIL_PASS`.
   - _Note: Remove all spaces when adding this to your environment variables._

## Environment Configuration

Add the following to your `.env.local` or production environment:

```env
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="abcdefghijklmnop"
```
