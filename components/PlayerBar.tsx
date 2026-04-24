"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import type { CallbackState } from "react-spotify-web-playback"
import { useTheme } from "next-themes"
import { AlertTriangleIcon, LoaderCircleIcon } from "lucide-react"
import { getValidAccessToken } from "@/lib/api"
import { getStoredAuth } from "@/lib/auth"
import { useGlobalStore } from "@/store/useStore"

const SpotifyPlayer = dynamic(() => import("react-spotify-web-playback"), {
  ssr: false,
})

export default function PlayerBar() {
  const { resolvedTheme } = useTheme()
  const requestedPlaybackUri = useGlobalStore((state) => state.requestedPlaybackUri)
  const requestedOffset = useGlobalStore((state) => state.requestedOffset)
  const playbackError = useGlobalStore((state) => state.playbackError)
  const syncPlayerState = useGlobalStore((state) => state.syncPlayerState)
  const setPlaybackError = useGlobalStore((state) => state.setPlaybackError)
  const [token, setToken] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    const auth = getStoredAuth()

    if (auth?.access_token) {
      setToken(auth.access_token)
    }
  }, [])

  const handleTokenRefresh = async (callback: (token: string) => void) => {
    const nextToken = await getValidAccessToken()

    if (!nextToken) {
      setPlaybackError("Spotify authentication expired. Sign in again.")
      return
    }

    setToken(nextToken)
    callback(nextToken)
  }

  const handleCallback = (state: CallbackState) => {
    syncPlayerState(state)

    if (state.error) {
      setPlaybackError(state.error)
      return
    }

    if (playbackError) {
      setPlaybackError(null)
    }
  }

  const playerUris = requestedPlaybackUri ? [requestedPlaybackUri] : []
  const playerOffset = requestedPlaybackUri ? requestedOffset : undefined
  const isDark = resolvedTheme !== "light"
  const playerStyles = {
    activeColor: isDark ? "#1ed760" : "#16a34a",
    bgColor: isDark ? "#0f1115" : "#ffffff",
    color: isDark ? "#e5e7eb" : "#111827",
    errorColor: "#ef4444",
    height: 88,
    loaderColor: isDark ? "#1ed760" : "#16a34a",
    sliderColor: isDark ? "#1ed760" : "#16a34a",
    sliderHandleBorderRadius: 999,
    sliderHandleColor: isDark ? "#ffffff" : "#111827",
    sliderHeight: 4,
    sliderTrackBorderRadius: 999,
    sliderTrackColor: isDark ? "#2a2f3a" : "#d1d5db",
    trackArtistColor: isDark ? "#9ca3af" : "#6b7280",
    trackNameColor: isDark ? "#f9fafb" : "#111827",
  } as const

  if (!isMounted || !token) {
    return (
      <footer className="border-t border-border/60 bg-background/80 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/70 md:px-6">
        <div className="mx-auto flex w-full max-w-[1800px] items-center gap-3 text-sm text-muted-foreground">
          <LoaderCircleIcon className="size-4 animate-spin" />
          Connecting Sonara to Spotify...
        </div>
      </footer>
    )
  }

  return (
    <footer className="border-t border-border/60 bg-background/80 px-2 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/70 md:px-4">
      {playbackError ? (
        <div className="mx-auto mb-2 flex w-full max-w-[1800px] items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          <AlertTriangleIcon className="size-4 shrink-0" />
          <span className="truncate">{playbackError}</span>
        </div>
      ) : null}
      <div className="mx-auto w-full max-w-[1800px] overflow-hidden rounded-2xl border border-border/60">
        <SpotifyPlayer
          token={token}
          getOAuthToken={handleTokenRefresh}
          callback={handleCallback}
          uris={playerUris}
          offset={playerOffset}
          play={Boolean(requestedPlaybackUri)}
          preloadData={Boolean(requestedPlaybackUri)}
          persistDeviceSelection
          magnifySliderOnHover
          name="Sonara Web Player"
          styles={playerStyles}
        />
      </div>
    </footer>
  )
}
