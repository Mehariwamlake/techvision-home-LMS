import 'server-only'

import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto'
import { cookies } from 'next/headers'

export const SESSION_COOKIE = 'tv_frappe_session'
const SESSION_TTL = 60 * 60 * 12

export type FrappeSession = { sid: string; user: string; expiresAt: number }

function getKey() {
  const secret = process.env.AUTH_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('AUTH_SECRET must be configured with at least 32 characters.')
  }
  return createHash('sha256').update(secret).digest()
}

export function sealSession(session: FrappeSession) {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', getKey(), iv)
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(session), 'utf8'), cipher.final()])
  return [iv.toString('base64url'), cipher.getAuthTag().toString('base64url'), encrypted.toString('base64url')].join('.')
}

export function unsealSession(value: string): FrappeSession | null {
  try {
    const [ivText, tagText, encryptedText] = value.split('.')
    if (!ivText || !tagText || !encryptedText) return null
    const decipher = createDecipheriv('aes-256-gcm', getKey(), Buffer.from(ivText, 'base64url'))
    decipher.setAuthTag(Buffer.from(tagText, 'base64url'))
    const clear = Buffer.concat([decipher.update(Buffer.from(encryptedText, 'base64url')), decipher.final()])
    const session = JSON.parse(clear.toString('utf8')) as FrappeSession
    if (!session.sid || !session.user || session.expiresAt <= Date.now()) return null
    return session
  } catch {
    return null
  }
}

export async function getSession() {
  const jar = await cookies()
  const value = jar.get(SESSION_COOKIE)?.value
  return value ? unsealSession(value) : null
}

export function frappeUrl() {
  const value = process.env.FRAPPE_URL || 'https://learn.techvision.edu.et'
  return value.replace(/\/+$/, '')
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_TTL,
  }
}

export const sessionTtlSeconds = SESSION_TTL
