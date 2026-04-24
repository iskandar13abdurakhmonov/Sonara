import type { StateCreator } from "zustand"
import type { CallbackState } from "react-spotify-web-playback"

export type PlaybackTrack = {
  id: string
  uri: string
  name: string
  artists: string[]
  duration_ms: number
  imageUrl?: string
}

export type PlayerSlice = {
  currentTrack: PlaybackTrack | null
  currentContextUri: string | null
  requestedPlaybackUri: string | null
  requestedOffset: number
  deviceId: string | null
  deviceName: string | null
  playerReady: boolean
  isPlaying: boolean
  isActiveDevice: boolean
  currentTime: number
  duration: number
  volume: number
  playbackError: string | null
  requestPlayback: (payload: {
    playbackUri: string
    offset?: number
  }) => void
  setPlaybackError: (playbackError: string | null) => void
  syncPlayerState: (state: CallbackState) => void
}

const mapPlayerStatusToReady = (status: CallbackState["status"]) =>
  status === "READY" || status === "RUNNING" || status === "IDLE"

export const createPlayerSlice: StateCreator<PlayerSlice> = (set) => ({
  currentTrack: null,
  currentContextUri: null,
  requestedPlaybackUri: null,
  requestedOffset: 0,
  deviceId: null,
  deviceName: null,
  playerReady: false,
  isPlaying: false,
  isActiveDevice: false,
  currentTime: 0,
  duration: 0,
  volume: 65,
  playbackError: null,
  requestPlayback: ({ playbackUri, offset = 0 }) =>
    set({
      requestedPlaybackUri: playbackUri,
      requestedOffset: offset,
      playbackError: null,
    }),
  setPlaybackError: (playbackError) => set({ playbackError }),
  syncPlayerState: (state) =>
    set({
      currentTrack: state.track?.uri
        ? {
            id: state.track.id,
            uri: state.track.uri,
            name: state.track.name,
            artists: state.track.artists.map((artist) => artist.name),
            duration_ms: state.track.durationMs,
            imageUrl: state.track.image,
          }
        : null,
      currentContextUri: state.currentURI || null,
      deviceId: state.currentDeviceId || state.deviceId || null,
      deviceName:
        state.devices.find((device) => device.id === state.currentDeviceId)?.name ||
        state.devices.find((device) => device.id === state.deviceId)?.name ||
        null,
      playerReady: mapPlayerStatusToReady(state.status),
      isPlaying: state.isPlaying,
      isActiveDevice: state.isActive,
      currentTime: state.progressMs / 1000,
      duration: state.track?.durationMs ? state.track.durationMs / 1000 : 0,
      volume: Math.round(state.volume * 100),
      playbackError: state.error || null,
    }),
})
