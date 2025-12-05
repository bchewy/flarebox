import { Hono } from 'hono'
import { renderer } from './renderer'
import auth from './routes/auth'
import files from './routes/files'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { SharePage } from './pages/Share'
import { requireAuth } from './middleware/auth'
import type { Env } from './types'

function sanitizeFilename(name: string): string {
  return name.replace(/["\r\n]/g, '_')
}

const app = new Hono<{ Bindings: Env }>()

// Security headers middleware
app.use('*', async (c, next) => {
  await next()
  c.res.headers.set('X-Content-Type-Options', 'nosniff')
  c.res.headers.set('X-Frame-Options', 'DENY')
  c.res.headers.set('X-XSS-Protection', '1; mode=block')
  c.res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  c.res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
})

app.use(renderer)

// Logging middleware for all API routes
app.use('/api/*', async (c, next) => {
  const start = Date.now()
  const method = c.req.method
  const path = c.req.path
  
  console.log(`→ ${method} ${path}`)
  
  await next()
  
  const duration = Date.now() - start
  const status = c.res.status
  console.log(`← ${method} ${path} ${status} (${duration}ms)`)
})

app.route('/api/auth', auth)
app.route('/api/files', files)

// Public share endpoint (no auth)
app.get('/api/share/:key', async (c) => {
  const key = c.req.param('key')
  const object = await c.env.FILES.get(key)
  
  // Return same error for "not found" and "not shared" to prevent enumeration
  if (!object || object.customMetadata?.shared !== 'true') {
    return c.json({ error: 'File not found' }, 404)
  }
  
  const filename = sanitizeFilename(object.customMetadata?.originalName || key)
  const headers = new Headers()
  headers.set('Content-Type', object.httpMetadata?.contentType || 'application/octet-stream')
  headers.set('Content-Disposition', `inline; filename="${filename}"`)
  headers.set('Cache-Control', 'public, max-age=3600')
  
  return new Response(object.body, { headers })
})

// Public share page
app.get('/s/:key', async (c) => {
  const key = c.req.param('key')
  const object = await c.env.FILES.head(key)
  
  if (!object || object.customMetadata?.shared !== 'true') {
    return c.render(
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'system-ui' }}>
        <h1>File not found</h1>
        <p>This file doesn't exist or is no longer shared.</p>
      </div>
    )
  }
  
  return c.render(<SharePage fileKey={key} fileName={object.customMetadata?.originalName || key} contentType={object.httpMetadata?.contentType || 'application/octet-stream'} />)
})

app.get('/login', (c) => {
  return c.render(<Login />)
})

app.get('/dashboard', requireAuth, (c) => {
  return c.render(<Dashboard />)
})

app.get('/', (c) => {
  return c.redirect('/login')
})

export default app
