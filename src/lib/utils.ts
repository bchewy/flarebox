/**
 * Sanitizes a filename by removing potentially dangerous characters
 */
export function sanitizeFilename(name: string): string {
  return name.replace(/["\r\n]/g, '_')
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
export function safeCompare(a: string, b: string): boolean {
  const lengthMatch = a.length === b.length
  if (!lengthMatch) {
    // Compare against itself to maintain constant time even on length mismatch
    b = a
  }
  let result = lengthMatch ? 0 : 1
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

/**
 * Helper to get metadata - handles both camelCase (direct upload) and lowercase (presigned URL)
 */
export function getMetadata(meta: Record<string, string> | undefined, key: string): string | undefined {
  if (!meta) return undefined
  // Try camelCase first (direct upload), then lowercase (presigned URL)
  return meta[key] ?? meta[key.toLowerCase()]
}
