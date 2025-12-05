import { Hono } from 'hono'
import { generateOTP, generateChallenge, storeOTP, validateOTP, checkRateLimit } from '../lib/otp'
import { sendOTPEmail } from '../lib/email'
import { createSession, setSessionCookie, clearSession } from '../middleware/auth'
import type { Env } from '../types'

const auth = new Hono<{ Bindings: Env }>()

auth.post('/login', async (c) => {
  try {
    // Rate limit: 5 requests per 15 minutes
    const allowed = await checkRateLimit(c.env.SESSIONS, 'login', 5, 900)
    if (!allowed) {
      return c.json({ error: 'Too many requests. Try again later.' }, 429)
    }

    const otp = generateOTP()
    const challenge = generateChallenge()
    await storeOTP(c.env.SESSIONS, challenge, otp, c.env.DROPBOX_EMAIL)
    await sendOTPEmail(c.env.RESEND_API_KEY, c.env.DROPBOX_EMAIL, otp)
    
    return c.json({ success: true, challenge, message: 'OTP sent to email' })
  } catch (error) {
    return c.json({ error: 'Failed to send code' }, 500)
  }
})

auth.post('/verify-otp', async (c) => {
  const { challenge, otp } = await c.req.json()
  
  if (!challenge || !otp) {
    return c.json({ error: 'Challenge and OTP required' }, 400)
  }

  // Rate limit: 10 attempts per challenge per 5 minutes
  const allowed = await checkRateLimit(c.env.SESSIONS, `verify:${challenge}`, 10, 300)
  if (!allowed) {
    return c.json({ error: 'Too many attempts. Request a new code.' }, 429)
  }
  
  const result = await validateOTP(c.env.SESSIONS, challenge, otp)
  
  if (!result.valid) {
    return c.json({ error: 'Invalid or expired OTP' }, 401)
  }
  
  if (!c.env.JWT_SECRET) {
    return c.json({ error: 'Server misconfigured: JWT_SECRET not set' }, 500)
  }
  
  const token = await createSession(result.email!, c.env.JWT_SECRET)
  setSessionCookie(c, token)
  
  return c.json({ success: true })
})

auth.post('/password', async (c) => {
  const { password } = await c.req.json()
  
  if (!password) {
    return c.json({ error: 'Password required' }, 400)
  }

  // Rate limit: 5 attempts per 15 minutes
  const allowed = await checkRateLimit(c.env.SESSIONS, 'password', 5, 900)
  if (!allowed) {
    return c.json({ error: 'Too many attempts. Try again later.' }, 429)
  }
  
  if (password !== c.env.DROPBOX_PASSWORD) {
    return c.json({ error: 'Invalid password' }, 401)
  }
  
  if (!c.env.JWT_SECRET) {
    return c.json({ error: 'Server misconfigured: JWT_SECRET not set' }, 500)
  }
  
  const token = await createSession(c.env.DROPBOX_EMAIL, c.env.JWT_SECRET)
  setSessionCookie(c, token)
  
  return c.json({ success: true })
})

auth.post('/logout', async (c) => {
  clearSession(c)
  return c.json({ success: true })
})

export default auth

