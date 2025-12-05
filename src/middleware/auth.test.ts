import { describe, it, expect } from 'vitest'
import { createSession } from './auth'

describe('createSession', () => {
  const testSecret = 'test-secret-key-for-jwt'
  const testEmail = 'test@example.com'

  it('returns a JWT string', async () => {
    const token = await createSession(testEmail, testSecret)
    expect(typeof token).toBe('string')
    expect(token.length).toBeGreaterThan(0)
  })

  it('returns a valid JWT format (3 parts separated by dots)', async () => {
    const token = await createSession(testEmail, testSecret)
    const parts = token.split('.')
    expect(parts).toHaveLength(3)
  })

  it('contains email in payload', async () => {
    const token = await createSession(testEmail, testSecret)
    const [, payloadBase64] = token.split('.')
    const payload = JSON.parse(atob(payloadBase64))
    expect(payload.email).toBe(testEmail)
  })

  it('contains iat (issued at) timestamp', async () => {
    const token = await createSession(testEmail, testSecret)
    const [, payloadBase64] = token.split('.')
    const payload = JSON.parse(atob(payloadBase64))
    expect(payload.iat).toBeDefined()
    expect(typeof payload.iat).toBe('number')
  })

  it('contains exp (expiration) timestamp', async () => {
    const token = await createSession(testEmail, testSecret)
    const [, payloadBase64] = token.split('.')
    const payload = JSON.parse(atob(payloadBase64))
    expect(payload.exp).toBeDefined()
    expect(typeof payload.exp).toBe('number')
  })

  it('sets expiration to 7 days from now', async () => {
    const before = Math.floor(Date.now() / 1000)
    const token = await createSession(testEmail, testSecret)
    const after = Math.floor(Date.now() / 1000)
    
    const [, payloadBase64] = token.split('.')
    const payload = JSON.parse(atob(payloadBase64))
    
    const sevenDays = 60 * 60 * 24 * 7
    // exp should be approximately iat + 7 days
    expect(payload.exp - payload.iat).toBe(sevenDays)
    // iat should be within the time window of the test
    expect(payload.iat).toBeGreaterThanOrEqual(before)
    expect(payload.iat).toBeLessThanOrEqual(after)
  })

  it('generates different tokens for different emails', async () => {
    const token1 = await createSession('user1@example.com', testSecret)
    const token2 = await createSession('user2@example.com', testSecret)
    expect(token1).not.toBe(token2)
  })

  it('generates different tokens for different secrets', async () => {
    const token1 = await createSession(testEmail, 'secret1')
    const token2 = await createSession(testEmail, 'secret2')
    expect(token1).not.toBe(token2)
  })
})
