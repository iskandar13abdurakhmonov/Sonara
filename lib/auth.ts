const DEFAULT_SONARA_API_URL = "http://localhost:4000"
const DEFAULT_SONARA_APP_URL = "http://localhost:3000"
export const DEFAULT_POST_LOGIN_PATH = "/player"
export const AUTH_STORAGE_KEY = "sonara.spotify.auth"

export type SonaraAuthResult = {
  access_token?: string
  refresh_token?: string
  expires_in?: string
  scope?: string
  token_type?: string
  error?: string
  message?: string
  details?: string
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "")
}

function normalizeBaseUrl(value: string) {
  const parsed = new URL(value)

  parsed.pathname = ""
  parsed.search = ""
  parsed.hash = ""

  return trimTrailingSlash(parsed.toString())
}

function normalizeNextPath(nextPath?: string) {
  if (!nextPath || !nextPath.startsWith("/")) {
    return DEFAULT_POST_LOGIN_PATH
  }

  return nextPath
}

export function getSonaraApiUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SONARA_API_URL?.trim()

  if (!configuredUrl) {
    return DEFAULT_SONARA_API_URL
  }

  return normalizeBaseUrl(configuredUrl)
}

export function getSonaraAppUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SONARA_APP_URL?.trim()

  if (!configuredUrl) {
    return DEFAULT_SONARA_APP_URL
  }

  return normalizeBaseUrl(configuredUrl)
}

export function buildSonaraSignInUrl(nextPath?: string) {
  const loginUrl = new URL("/auth/login", getSonaraApiUrl())
  const callbackUrl = new URL("/auth/callback", getSonaraAppUrl())

  callbackUrl.searchParams.set("next", normalizeNextPath(nextPath))
  loginUrl.searchParams.set("return_to", callbackUrl.toString())

  return loginUrl.toString()
}

export function parseAuthHashParams(hash: string): SonaraAuthResult {
  const params = new URLSearchParams(hash.replace(/^#/, ""))

  return {
    access_token: params.get("access_token") || undefined,
    refresh_token: params.get("refresh_token") || undefined,
    expires_in: params.get("expires_in") || undefined,
    scope: params.get("scope") || undefined,
    token_type: params.get("token_type") || undefined,
    error: params.get("error") || undefined,
    message: params.get("message") || undefined,
    details: params.get("details") || undefined,
  }
}

export function getSafeNextPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/")) {
    return DEFAULT_POST_LOGIN_PATH
  }

  return value
}
