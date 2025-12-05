export type Env = {
  FILES: R2Bucket
  SESSIONS: KVNamespace
  DROPBOX_EMAIL: string
  DROPBOX_PASSWORD: string
  RESEND_API_KEY: string
  JWT_SECRET: string
  // R2 S3 API credentials (for presigned URLs)
  R2_ACCESS_KEY_ID: string
  R2_SECRET_ACCESS_KEY: string
  R2_ENDPOINT: string
  R2_BUCKET_NAME: string
}

