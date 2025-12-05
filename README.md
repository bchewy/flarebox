# FlareBox

A secure, password-protected file storage application built on Cloudflare's edge infrastructure.

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Browser                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Cloudflare Edge Network                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Cloudflare Worker (Hono App)                 │  │
│  │  ┌─────────────────┬────────────────┬──────────────────┐  │  │
│  │  │   Auth Routes   │  File Routes   │  Page Rendering  │  │  │
│  │  │   /api/auth/*   │  /api/files/*  │  /login, /dash   │  │  │
│  │  └────────┬────────┴───────┬────────┴────────┬─────────┘  │  │
│  │           │                │                 │            │  │
│  │  ┌────────▼────────┐  ┌────▼────┐  ┌────────▼─────────┐  │  │
│  │  │   KV Namespace   │  │   R2    │  │  Resend Email    │  │  │
│  │  │   (Sessions)     │  │ Bucket  │  │    Service       │  │  │
│  │  └──────────────────┘  └─────────┘  └──────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Features

- **Dual Authentication**: Password login or email OTP (2FA)
- **Large File Support**: Direct uploads up to 50MB, presigned URLs for larger files (up to 5GB)
- **Virtual Folders**: Organize files into folders with drag-and-drop support
- **Public Sharing**: Generate shareable links for individual files
- **File Preview**: In-browser preview for images, PDFs, videos, audio, and text files
- **Bulk Operations**: Select multiple files to move, download (as ZIP), or delete
- **Mobile Responsive**: Full-featured mobile UI with bottom navigation

## Tech Stack

| Component | Technology |
|-----------|------------|
| Runtime | Cloudflare Workers |
| Framework | Hono |
| File Storage | Cloudflare R2 |
| Session/OTP Storage | Cloudflare KV |
| Email | Resend |
| Build Tool | Vite + @cloudflare/vite-plugin |
| Styling | Vanilla CSS |

---

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Cloudflare Resources

```bash
# Create R2 bucket for file storage
wrangler r2 bucket create flarebox-files

# Create KV namespace for sessions and OTP codes
wrangler kv:namespace create sessions
wrangler kv:namespace create sessions --preview

# Create R2 API token for presigned URLs (in Cloudflare dashboard)
# Dashboard → R2 → Manage R2 API Tokens → Create API Token
```

### 3. Configure R2 CORS (for presigned URL uploads)

```bash
wrangler r2 bucket cors put flarebox-files --file r2-cors.json
```

### 4. Update `wrangler.jsonc`

Replace placeholder IDs with actual values from step 2:
```jsonc
{
  "r2_buckets": [{
    "binding": "FILES",
    "bucket_name": "flarebox-files"  // Your bucket name
  }],
  "kv_namespaces": [{
    "binding": "SESSIONS",
    "id": "your-kv-namespace-id",
    "preview_id": "your-preview-kv-namespace-id"
  }]
}
```

### 5. Set Environment Secrets

For **production**:
```bash
wrangler secret put DROPBOX_PASSWORD
wrangler secret put DROPBOX_EMAIL
wrangler secret put JWT_SECRET
wrangler secret put RESEND_API_KEY
wrangler secret put R2_ACCESS_KEY_ID
wrangler secret put R2_SECRET_ACCESS_KEY
wrangler secret put R2_ENDPOINT        # https://<account-id>.r2.cloudflarestorage.com
wrangler secret put R2_BUCKET_NAME
```

For **local development**, create `.dev.vars`:
```bash
cp .dev.vars.example .dev.vars
# Edit .dev.vars with your values
```

### 6. Development

```bash
npm run dev
```

### 7. Deploy

```bash
npm run deploy
```

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `DROPBOX_EMAIL` | Authorized email for this dropbox (receives OTP codes) |
| `DROPBOX_PASSWORD` | Password for direct login |
| `JWT_SECRET` | Secret key for signing session JWTs |
| `RESEND_API_KEY` | API key from [resend.com](https://resend.com) |
| `R2_ACCESS_KEY_ID` | R2 S3 API access key (for presigned URLs) |
| `R2_SECRET_ACCESS_KEY` | R2 S3 API secret key |
| `R2_ENDPOINT` | R2 S3 endpoint: `https://<account-id>.r2.cloudflarestorage.com` |
| `R2_BUCKET_NAME` | Name of your R2 bucket |

---

## Technical Deep Dive

### Authentication Flow

**Password Auth:**
```
POST /api/auth/password {password}
  → Rate limit check (5 attempts/15min)
  → Compare to DROPBOX_PASSWORD
  → Create JWT, set httpOnly cookie
  → Redirect to /dashboard
```

**Email OTP Auth:**
```
POST /api/auth/login
  → Generate 6-digit OTP
  → Store in KV: challenge:{uuid} → {otp, email} (TTL: 5min)
  → Send email via Resend
  → Return challenge UUID

POST /api/auth/verify-otp {challenge, otp}
  → Fetch & delete from KV (one-time use)
  → Validate OTP
  → Create JWT, set httpOnly cookie
```

### File Upload Strategies

**Small files (<50MB):** Direct upload through Worker
```
Client → FormData → Worker → R2.put()
```

**Large files (>50MB):** Presigned URL direct to R2
```
Client → POST /api/files/upload-url
Worker → Generate signed S3 URL with metadata headers
Client → PUT directly to R2 S3 endpoint
```

The presigned URL approach bypasses the Worker's 128MB memory limit and 100MB request body limit.

### R2 Object Structure

Files are stored with keys: `{timestamp}-{filename}`

```typescript
{
  body: ArrayBuffer,           // File content
  httpMetadata: {
    contentType: 'image/png'
  },
  customMetadata: {
    originalName: 'photo.png',
    uploadedAt: '2024-01-15T10:30:00Z',
    shared: 'false',
    folder: '/Documents/Work'
  }
}
```

### Virtual Folder System

Folders exist only as metadata on files—there are no "folder objects" in R2.

- **Server-side**: `customMetadata.folder` stores the path (e.g., `/Documents/Work`)
- **Client-side**: Empty folders persist in `localStorage` until a file is added

Operations like "move folder" iterate all files with matching folder prefixes and update their metadata.

### Session Management

- **JWT payload**: `{ email, iat, exp }` (7-day expiry)
- **Cookie settings**: `httpOnly`, `secure`, `sameSite: Lax`
- **Storage**: Stateless (JWT contains all info), KV only used for OTP/rate limits

### Rate Limiting

Implemented via KV with TTL-based expiry:
- Login attempts: 5 per 15 minutes
- Password attempts: 5 per 15 minutes  
- OTP verification: 10 per challenge

---

## API Reference

### Auth Routes

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Request OTP email |
| POST | `/api/auth/verify-otp` | Verify OTP and create session |
| POST | `/api/auth/password` | Password login |
| POST | `/api/auth/logout` | Clear session cookie |

### File Routes (authenticated)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/files/list` | List all files and folders |
| GET | `/api/files/stats` | Get file count and total size |
| POST | `/api/files/upload` | Upload file (<50MB) |
| POST | `/api/files/upload-url` | Get presigned URL for large upload |
| GET | `/api/files/preview/:key` | Stream file (inline) |
| GET | `/api/files/download/:key` | Download file (attachment) |
| PATCH | `/api/files/rename/:key` | Rename file |
| PATCH | `/api/files/share/:key` | Toggle public sharing |
| PATCH | `/api/files/move/:key` | Move file to folder |
| DELETE | `/api/files/:key` | Delete file |
| PATCH | `/api/files/folders/move` | Move folder and contents |
| DELETE | `/api/files/folders/*` | Delete folder and contents |

### Public Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/share/:key` | Download shared file |
| GET | `/s/:key` | Shared file preview page |

---

## Security

| Threat | Mitigation |
|--------|------------|
| Brute force | KV-based rate limiting |
| Session theft | httpOnly + secure cookies |
| CSRF | SameSite=Lax cookies |
| XSS | No user HTML rendering, CSP headers |
| Path traversal | Filename sanitization |
| Replay attacks | One-time OTP deletion |

---

## Cloudflare Limits

| Resource | Limit |
|----------|-------|
| Worker CPU time | 50ms (free), 30s (paid) |
| Worker memory | 128MB |
| Request body | 100MB (use presigned URLs for larger) |
| R2 object size | 5GB (single PUT) |
| KV value size | 1MB |
| KV consistency | Eventually consistent |

---

## Project Structure

```
src/
├── index.tsx           # Hono app entry, route registration
├── types.ts            # TypeScript types for Cloudflare bindings
├── renderer.tsx        # JSX HTML shell renderer
├── style.css           # All styles
├── lib/
│   ├── otp.ts          # OTP generation, validation, rate limiting
│   └── email.ts        # Resend email sending
├── middleware/
│   └── auth.ts         # JWT session management
├── routes/
│   ├── auth.tsx        # /api/auth/* handlers
│   └── files.tsx       # /api/files/* handlers
└── pages/
    ├── Login.tsx       # Login page component
    ├── Dashboard.tsx   # Main file manager UI
    └── Share.tsx       # Public share page
```

---

## License

MIT
