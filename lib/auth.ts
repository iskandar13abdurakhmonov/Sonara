export const DEFAULT_POST_LOGIN_PATH = "/player"
export const AUTH_STORAGE_KEY = "sonara.spotify.auth"
export const DEFAULT_SONARA_API_URL = "http://localhost:4000"
export const DEFAULT_SONARA_APP_URL = "http://localhost:3000"
export const AUTH_REFRESH_PATH = "/auth/refresh"
const TOKEN_REFRESH_BUFFER_MS = 30_000

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

export type StoredSonaraAuth = SonaraAuthResult & {
  expires_at?: string
  nextPath?: string
  received_at?: string
}

export const getSonaraApiBaseUrl = () =>
  process.env.NEXT_PUBLIC_SONARA_API_URL?.trim() || DEFAULT_SONARA_API_URL

export const getStoredAuth = (): StoredSonaraAuth | null => {
  if (typeof window === "undefined") {
    return null
  }

  const storedAuth = window.sessionStorage.getItem(AUTH_STORAGE_KEY)

  if (!storedAuth) {
    return null
  }

  try {
    return JSON.parse(storedAuth) as StoredSonaraAuth
  } catch {
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

export const persistAuth = (auth: StoredSonaraAuth) => {
  if (typeof window === "undefined") {
    return auth
  }

  const receivedAt = auth.received_at || new Date().toISOString()
  const expiresAt =
    auth.expires_at ||
    deriveExpiresAt({
      expiresIn: auth.expires_in,
      receivedAt,
    })

  const nextAuth: StoredSonaraAuth = {
    ...auth,
    received_at: receivedAt,
    expires_at: expiresAt,
  }

  window.sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth))

  return nextAuth
}

export const clearStoredAuth = () => {
  if (typeof window === "undefined") {
    return
  }

  window.sessionStorage.removeItem(AUTH_STORAGE_KEY)
}

export const deriveExpiresAt = ({
  expiresIn,
  receivedAt = new Date().toISOString(),
}: {
  expiresIn?: string
  receivedAt?: string
}) => {
  const expiresInMs = Number(expiresIn) * 1000

  if (!Number.isFinite(expiresInMs) || expiresInMs <= 0) {
    return undefined
  }

  return new Date(new Date(receivedAt).getTime() + expiresInMs).toISOString()
}

export const isAccessTokenExpired = (
  auth: Pick<StoredSonaraAuth, "expires_at"> | null | undefined,
) => {
  if (!auth?.expires_at) {
    return false
  }

  const expiresAtMs = new Date(auth.expires_at).getTime()

  if (!Number.isFinite(expiresAtMs)) {
    return false
  }

  return expiresAtMs <= Date.now() + TOKEN_REFRESH_BUFFER_MS
}
