export function generateOTP(): string {
  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  return String(100000 + (array[0] % 900000))
}

export function generateChallenge(): string {
  return crypto.randomUUID()
}

export async function storeOTP(
  kv: KVNamespace,
  challenge: string,
  otp: string,
  email: string
): Promise<void> {
  const key = `challenge:${challenge}`
  const value = JSON.stringify({ otp, email, timestamp: Date.now() })
  await kv.put(key, value, { expirationTtl: 300 }) // 5 minutes
}

export async function validateOTP(
  kv: KVNamespace,
  challenge: string,
  otp: string
): Promise<{ valid: boolean; email?: string }> {
  const key = `challenge:${challenge}`
  const stored = await kv.get(key)
  
  if (!stored) {
    return { valid: false }
  }
  
  const data = JSON.parse(stored)
  await kv.delete(key) // One-time use
  
  if (data.otp !== otp) {
    return { valid: false }
  }
  
  return { valid: true, email: data.email }
}

// Rate limiting helper
export async function checkRateLimit(
  kv: KVNamespace,
  key: string,
  limit: number,
  windowSec: number
): Promise<boolean> {
  const rateKey = `rate:${key}`
  const current = parseInt(await kv.get(rateKey) || '0')
  if (current >= limit) return false
  await kv.put(rateKey, String(current + 1), { expirationTtl: windowSec })
  return true
}

