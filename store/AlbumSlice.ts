import type { StateCreator } from "zustand"
import { getAlbum } from "@/lib/albumService"

export type AlbumTrack = {
  artists: Array<{
    id: string
    name: string
    uri: string
  }>
  disc_number: number
  duration_ms: number
  explicit: boolean
  id: string
  name: string
  preview_url: string | null
  track_number: number
  uri: string
}

export type SpotifyAlbum = {
  album_type: string
  artists: Array<{
    id: string
    name: string
    uri: string
  }>
  copyrights: Array<{
    text: string
    type: string
  }>
  external_urls: {
    spotify: string
  }
  genres: string[]
  id: string
  images: Array<{
    url: string
    height: number
    width: number
  }>
  label: string
  name: string
  popularity: number
  release_date: string
  total_tracks: number
  tracks: {
    items: AlbumTrack[]
  }
  type: string
  uri: string
}

export type AlbumSlice = {
  album: SpotifyAlbum | null
  albumLoading: boolean
  getAlbum: (albumId: string) => Promise<SpotifyAlbum | null>
}

const albumCache = new Map<string, SpotifyAlbum>()
const albumRequests = new Map<string, Promise<SpotifyAlbum | null>>()

export const createAlbumSlice: StateCreator<AlbumSlice> = (set) => ({
  album: null,
  albumLoading: false,
  getAlbum: async (albumId) => {
    const cachedAlbum = albumCache.get(albumId)

    if (cachedAlbum) {
      set({
        album: cachedAlbum,
        albumLoading: false,
      })

      return cachedAlbum
    }

    const existingAlbumRequest = albumRequests.get(albumId)

    if (existingAlbumRequest) {
      return existingAlbumRequest
    }

    set({
      albumLoading: true,
    })

    const albumRequest = (async () => {
      try {
        const { data } = await getAlbum(albumId)
        const album = data as SpotifyAlbum

        albumCache.set(albumId, album)

        set({
          album,
        })

        return album
      } catch (error) {
        set({
          album: null,
        })

        return null
      } finally {
        albumRequests.delete(albumId)
        set({
          albumLoading: false,
        })
      }
    })()

    albumRequests.set(albumId, albumRequest)

    return albumRequest
  },
})
