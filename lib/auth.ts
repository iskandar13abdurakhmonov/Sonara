export const DEFAULT_POST_LOGIN_PATH = "/player"
export const AUTH_STORAGE_KEY = "sonara.spotify.auth"
export const DEFAULT_SONARA_API_URL = "http://localhost:4000"
export const DEFAULT_SONARA_APP_URL = "http://localhost:3000"

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
