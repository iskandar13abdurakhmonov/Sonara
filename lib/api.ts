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
}

const refreshClient = axios.create({
  timeout: 10000,
})

let refreshPromise: Promise<string | null> | null = null

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

const getValidAccessToken = async () => {
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
