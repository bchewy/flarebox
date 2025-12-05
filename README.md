# Secure Dropbox

A password-protected file storage application built with Hono, Cloudflare Workers, and R2 storage.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Cloudflare Resources

```bash
# Create R2 bucket for file storage
wrangler r2 bucket create dropbox-brian-files

# Create KV namespace for sessions and OTP codes
wrangler kv:namespace create sessions
wrangler kv:namespace create sessions --preview
```

After creating the KV namespace, update `wrangler.jsonc` with the actual namespace IDs (replace `placeholder-id` and `placeholder-preview-id`).

### 3. Set Environment Secrets

```bash
wrangler secret put DROPBOX_PASSWORD
wrangler secret put DROPBOX_EMAIL
wrangler secret put RESEND_API_KEY
```

Get your Resend API key from [resend.com](https://resend.com).

### 4. Development

```bash
npm run dev
```

### 5. Deploy

```bash
npm run deploy
```

## Features

- Password authentication + email 2FA (OTP)
- Secure file upload/download via R2 storage
- Drag & drop file upload
- File management (list, download, delete)
- Session-based authentication with JWT cookies

## Architecture

- **R2**: File storage (up to 5GB per file)
- **KV**: Session storage and OTP codes (5 min expiry)
- **Resend**: Email OTP delivery
- **Hono**: Web framework
- **Cloudflare Workers**: Serverless runtime
