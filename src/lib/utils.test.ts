import { describe, it, expect } from 'vitest'
import { sanitizeFilename, safeCompare, getMetadata } from './utils'

describe('sanitizeFilename', () => {
  it('removes double quotes', () => {
    expect(sanitizeFilename('file"name.txt')).toBe('file_name.txt')
  })

  it('removes carriage returns', () => {
    expect(sanitizeFilename('file\rname.txt')).toBe('file_name.txt')
  })

  it('removes newlines', () => {
    expect(sanitizeFilename('file\nname.txt')).toBe('file_name.txt')
  })

  it('removes multiple dangerous characters', () => {
    expect(sanitizeFilename('bad"\r\nfile.txt')).toBe('bad___file.txt')
  })

  it('preserves safe characters', () => {
    expect(sanitizeFilename('my-file_name (1).txt')).toBe('my-file_name (1).txt')
  })

  it('handles empty string', () => {
    expect(sanitizeFilename('')).toBe('')
  })
})

describe('safeCompare', () => {
  it('returns true for identical strings', () => {
    expect(safeCompare('password123', 'password123')).toBe(true)
  })

  it('returns false for different strings of same length', () => {
    expect(safeCompare('password123', 'password456')).toBe(false)
  })

  it('returns false for different lengths', () => {
    expect(safeCompare('short', 'longerstring')).toBe(false)
  })

  it('returns false when first is longer', () => {
    expect(safeCompare('longerstring', 'short')).toBe(false)
  })

  it('returns true for empty strings', () => {
    expect(safeCompare('', '')).toBe(true)
  })

  it('returns false for empty vs non-empty', () => {
    expect(safeCompare('', 'something')).toBe(false)
    expect(safeCompare('something', '')).toBe(false)
  })

  it('handles special characters', () => {
    expect(safeCompare('p@$$w0rd!', 'p@$$w0rd!')).toBe(true)
    expect(safeCompare('p@$$w0rd!', 'p@$$w0rd?')).toBe(false)
  })
})

describe('getMetadata', () => {
  it('returns undefined for undefined meta', () => {
    expect(getMetadata(undefined, 'key')).toBeUndefined()
  })

  it('returns value for exact key match (camelCase)', () => {
    const meta = { originalName: 'test.txt' }
    expect(getMetadata(meta, 'originalName')).toBe('test.txt')
  })

  it('falls back to lowercase key', () => {
    const meta = { originalname: 'test.txt' }
    expect(getMetadata(meta, 'originalName')).toBe('test.txt')
  })

  it('prefers camelCase over lowercase', () => {
    const meta = { originalName: 'camel.txt', originalname: 'lower.txt' }
    expect(getMetadata(meta, 'originalName')).toBe('camel.txt')
  })

  it('returns undefined for non-existent key', () => {
    const meta = { someKey: 'value' }
    expect(getMetadata(meta, 'otherKey')).toBeUndefined()
  })

  it('handles empty metadata object', () => {
    expect(getMetadata({}, 'anyKey')).toBeUndefined()
  })
})
