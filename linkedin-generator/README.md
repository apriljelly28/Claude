# LinkedIn Post Generator

A free tool built by April Anne Kelly — Executive Ghostwriter for Cybersecurity Leaders.
https://aprilannekelly.com

---

## Deploy to Netlify

### 1. Push this folder to GitHub
Make sure your repo contains:
```
index.html
netlify.toml
netlify/functions/generate.js
```

### 2. Connect to Netlify
- Go to https://netlify.com and log in
- Click "Add new site" → "Import an existing project"
- Choose GitHub and select this repo
- Click "Deploy site"

### 3. Add your Anthropic API key
- In Netlify, go to Site Settings → Environment Variables
- Add a new variable:
  - Key: `ANTHROPIC_API_KEY`
  - Value: your API key from https://console.anthropic.com
- Trigger a redeploy (Deploys → Trigger deploy)

### 4. Add your email signup link
In `index.html`, find this line:
```
href="YOUR_EMAIL_SIGNUP_URL"
```
Replace `YOUR_EMAIL_SIGNUP_URL` with your actual signup link (Mailchimp, Flodesk, ConvertKit, etc.)

---

## How the gate works
Users get 3 free generations tracked in their browser's localStorage.
After 3 uses, the gate modal appears prompting them to join your email list.
The gate fires automatically after their third generation completes.
