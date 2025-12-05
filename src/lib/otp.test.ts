import { describe, it, expect, beforeEach } from 'vitest'
import { generateOTP, generateChallenge, storeOTP, validateOTP, checkRateLimit } from './otp'

// Simple KV mock
function createMockKV() {
  const store = new Map<string, string>()
  return {
    get: async (k: string) => store.get(k) ?? null,
    put: async (k: string, v: string, _opts?: { expirationTtl?: number }) => {
      store.set(k, v)
    },
    delete: async (k: string) => {
      store.delete(k)
    },
    _store: store, // For testing inspection
  } as unknown as KVNamespace
}

describe('generateOTP', () => {
  it('returns a 6-digit string', () => {
    const otp = generateOTP()
    expect(otp).toMatch(/^\d{6}$/)
  })

  it('returns value between 100000 and 999999', () => {
    for (let i = 0; i < 100; i++) {
      const otp = generateOTP()
      const num = parseInt(otp, 10)
      expect(num).toBeGreaterThanOrEqual(100000)
      expect(num).toBeLessThanOrEqual(999999)
    }
  })

  it('generates different values (not constant)', () => {
    const otps = new Set<string>()
    for (let i = 0; i < 50; i++) {
      otps.add(generateOTP())
    }
    // Should have multiple unique values
    expect(otps.size).toBeGreaterThan(10)
  })
})

describe('generateChallenge', () => {
  it('returns a valid UUID format', () => {
    const challenge = generateChallenge()
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    expect(challenge).toMatch(uuidRegex)
  })

  it('generates unique values', () => {
    const challenges = new Set<string>()
    for (let i = 0; i < 50; i++) {
      challenges.add(generateChallenge())
    }
    expect(challenges.size).toBe(50)
  })
})

describe('storeOTP', () => {
  let kv: ReturnType<typeof createMockKV>

  beforeEach(() => {
    kv = createMockKV()
  })

  it('stores OTP with correct key format', async () => {
    await storeOTP(kv, 'test-challenge', '123456', 'test@example.com')
    const stored = kv._store.get('challenge:test-challenge')
    expect(stored).toBeDefined()
  })

  it('stores email and OTP in value', async () => {
    await storeOTP(kv, 'test-challenge', '123456', 'test@example.com')
    const stored = kv._store.get('challenge:test-challenge')
    const data = JSON.parse(stored!)
    expect(data.otp).toBe('123456')
    expect(data.email).toBe('test@example.com')
    expect(data.timestamp).toBeDefined()
  })
})

describe('validateOTP', () => {
  let kv: ReturnType<typeof createMockKV>

  beforeEach(() => {
    kv = createMockKV()
  })

  it('returns valid=true for correct OTP', async () => {
    await storeOTP(kv, 'test-challenge', '123456', 'test@example.com')
    const result = await validateOTP(kv, 'test-challenge', '123456')
    expect(result.valid).toBe(true)
    expect(result.email).toBe('test@example.com')
  })

  it('returns valid=false for wrong OTP', async () => {
    await storeOTP(kv, 'test-challenge', '123456', 'test@example.com')
    const result = await validateOTP(kv, 'test-challenge', '999999')
    expect(result.valid).toBe(false)
    expect(result.email).toBeUndefined()
  })

  it('returns valid=false for non-existent challenge', async () => {
    const result = await validateOTP(kv, 'non-existent', '123456')
    expect(result.valid).toBe(false)
  })

  it('deletes challenge after validation (one-time use)', async () => {
    await storeOTP(kv, 'test-challenge', '123456', 'test@example.com')
    await validateOTP(kv, 'test-challenge', '123456')
    
    // Second attempt should fail
    const result = await validateOTP(kv, 'test-challenge', '123456')
    expect(result.valid).toBe(false)
  })
})

describe('checkRateLimit', () => {
  let kv: ReturnType<typeof createMockKV>

  beforeEach(() => {
    kv = createMockKV()
  })

  it('allows requests under limit', async () => {
    const result = await checkRateLimit(kv, 'test-key', 5, 300)
    expect(result).toBe(true)
  })

  it('allows requests up to limit', async () => {
    for (let i = 0; i < 5; i++) {
      const result = await checkRateLimit(kv, 'test-key', 5, 300)
      expect(result).toBe(true)
    }
  })

  it('blocks requests over limit', async () => {
    // Use up the limit
    for (let i = 0; i < 5; i++) {
      await checkRateLimit(kv, 'test-key', 5, 300)
    }
    
    // Next request should be blocked
    const result = await checkRateLimit(kv, 'test-key', 5, 300)
    expect(result).toBe(false)
  })

  it('tracks different keys separately', async () => {
    // Use up limit for key1
    for (let i = 0; i < 5; i++) {
      await checkRateLimit(kv, 'key1', 5, 300)
    }
    
    // key2 should still be allowed
    const result = await checkRateLimit(kv, 'key2', 5, 300)
    expect(result).toBe(true)
  })
})
