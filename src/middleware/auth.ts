import { Context, Next } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { sign, verify } from 'hono/jwt'
import type { Env } from '../types'

export async function requireAuth(c: Context<{ Bindings: Env }>, next: Next) {
  const token = getCookie(c, 'session')
  
  if (!token) {
    return c.redirect('/login')
  }
  
  try {
    const payload = await verify(token, c.env.JWT_SECRET)
    c.set('user', payload)
    await next()
  } catch {
    deleteCookie(c, 'session')
    return c.redirect('/login')
  }
}

export async function createSession(email: string, secret: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  return await sign({ 
    email, 
    iat: now,
    exp: now + (60 * 60 * 24 * 7) // 7 days
  }, secret)
}

export function clearSession(c: Context) {
  deleteCookie(c, 'session', {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    path: '/',
  })
}

export function setSessionCookie(c: Context, token: string) {
  setCookie(c, 'session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

