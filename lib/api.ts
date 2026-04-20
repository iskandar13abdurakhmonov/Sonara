import axios from "axios"
import { AUTH_STORAGE_KEY, type SonaraAuthResult } from "@/lib/auth"

export const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SPOTIFY_API_URL,
  timeout: 1000,
})

instance.interceptors.request.use(
  (config) => {
    if (typeof window === "undefined") {
      return config
    }

    const storedAuth = window.sessionStorage.getItem(AUTH_STORAGE_KEY)

    if (!storedAuth) {
      return config
    }

    let accessToken: string | undefined

    try {
      accessToken = (JSON.parse(storedAuth) as SonaraAuthResult).access_token
    } catch {
      return config
    }

    if (accessToken) {
      config.headers.set("Authorization", `Bearer ${accessToken}`)
    }

    return config
  },
  (error) => Promise.reject(error),
)
