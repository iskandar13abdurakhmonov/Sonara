import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosRequestHeaders,
} from "axios"
import {
  AUTH_REFRESH_PATH,
  clearStoredAuth,
  getSonaraApiBaseUrl,
  getStoredAuth,
  isAccessTokenExpired,
  persistAuth,
  type SonaraAuthResult,
} from "@/lib/auth"

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
  _retryCount?: number
}

const refreshClient = axios.create({
  timeout: 10000,
})

const RATE_LIMIT_STORAGE_KEY = "sonara.spotify.rate-limit-until"
const RATE_LIMIT_MAX_RETRIES = 1
const RATE_LIMIT_AUTO_RETRY_MAX_MS = 30_000
let refreshPromise: Promise<string | null> | null = null

const sleep = (ms: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })

const getRetryDelayMs = (retryAfter: unknown) => {
  const retryAfterSeconds = Number(retryAfter)

  if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds >= 0) {
    return retryAfterSeconds * 1000
  }

  return 1000
}

const getStoredRateLimitUntil = () => {
  if (typeof window === "undefined") {
    return 0
  }

  const storedUntil = Number(
    window.sessionStorage.getItem(RATE_LIMIT_STORAGE_KEY),
  )

  return Number.isFinite(storedUntil) ? storedUntil : 0
}

const setStoredRateLimitUntil = (until: number) => {
  if (typeof window === "undefined") {
    return
  }

  window.sessionStorage.setItem(RATE_LIMIT_STORAGE_KEY, String(until))
}

const clearStoredRateLimitUntil = () => {
  if (typeof window === "undefined") {
    return
  }

  window.sessionStorage.removeItem(RATE_LIMIT_STORAGE_KEY)
}

const createRateLimitError = (retryAfterMs: number) => {
  return new Error(
    `Spotify rate limit is active. Try again in ${Math.ceil(
      retryAfterMs / 1000,
    )} seconds.`,
  )
}

const setAuthorizationHeader = (
  headers: AxiosRequestHeaders,
  accessToken?: string,
) => {
  if (!accessToken) {
    return
  }

  headers.set("Authorization", `Bearer ${accessToken}`)
}

const buildRefreshUrl = () => {
  const apiUrl = new URL(getSonaraApiBaseUrl())

  apiUrl.pathname = AUTH_REFRESH_PATH
  apiUrl.search = ""
  apiUrl.hash = ""

  return apiUrl.toString()
}

const refreshAccessToken = async () => {
  if (typeof window === "undefined") {
    return null
  }

  if (!refreshPromise) {
    refreshPromise = (async () => {
      const auth = getStoredAuth()

      if (!auth?.refresh_token) {
        clearStoredAuth()
        return null
      }

      try {
        const response = await refreshClient.post<SonaraAuthResult>(
          buildRefreshUrl(),
          {
            refresh_token: auth.refresh_token,
          },
        )

        if (!response.data.access_token) {
          clearStoredAuth()
          return null
        }

        const nextAuth = persistAuth({
          ...auth,
          ...response.data,
          refresh_token: response.data.refresh_token || auth.refresh_token,
          nextPath: auth.nextPath,
        })

        return nextAuth.access_token || null
      } catch {
        clearStoredAuth()
        return null
      } finally {
        refreshPromise = null
      }
    })()
  }

  return refreshPromise
}

export const getValidAccessToken = async () => {
  const auth = getStoredAuth()

  if (!auth?.access_token) {
    return null
  }

  if (!isAccessTokenExpired(auth)) {
    return auth.access_token
  }

  return refreshAccessToken()
}

export const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SPOTIFY_API_URL,
  timeout: 10000,
})

instance.interceptors.request.use(
  async (config) => {
    if (typeof window === "undefined") {
      return config
    }

    const rateLimitUntil = getStoredRateLimitUntil()
    const retryAfterMs = rateLimitUntil - Date.now()

    if (retryAfterMs > 0) {
      return Promise.reject(createRateLimitError(retryAfterMs))
    }

    clearStoredRateLimitUntil()

    const accessToken = await getValidAccessToken()

    if (accessToken) {
      setAuthorizationHeader(config.headers as AxiosRequestHeaders, accessToken)
    }

    return config
  },
  (error) => Promise.reject(error),
)

instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (typeof window === "undefined") {
      return Promise.reject(error)
    }

    const config = error.config as RetriableRequestConfig | undefined

    if (config && error.response?.status === 429) {
      const retryDelayMs = getRetryDelayMs(error.response.headers["retry-after"])
      setStoredRateLimitUntil(Date.now() + retryDelayMs)
      config._retryCount = config._retryCount ?? 0

      if (
        retryDelayMs <= RATE_LIMIT_AUTO_RETRY_MAX_MS &&
        config._retryCount < RATE_LIMIT_MAX_RETRIES
      ) {
        config._retryCount += 1

        await sleep(retryDelayMs)

        return instance(config)
      }
    }

    if (!config || config._retry || error.response?.status !== 401) {
      return Promise.reject(error)
    }

    config._retry = true

    const accessToken = await refreshAccessToken()

    if (!accessToken) {
      return Promise.reject(error)
    }

    setAuthorizationHeader(config.headers as AxiosRequestHeaders, accessToken)

    return instance(config)
  },
)
