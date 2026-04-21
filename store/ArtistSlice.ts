import type { StateCreator } from "zustand"
import { getArtist, getArtistBanner, searchArtists } from "@/lib/artistService"

export type SpotifyArtists = {
  id: string
  name: string
  genres?: string[]
  popularity?: number
  type: string
  followers?: {
    total?: number
  }
  images?: Array<{
    url: string
    width: number
    height: number
  }>
  external_urls?: {
    spotify?: string
  }
}

export type SpotifyArtist = {
  external_urls: {
    spotify: string[]
  }
  followers: {
    href: string
    total: number
  }
  genres: string[]
  href: string
  id: string
  images: Array<{
    url: string
    height: number
    width: number
  }>
  name: string
  popularity: number
  type: string
  uri: string
}

type SpotifySearchResponse = {
  artists?: {
    items?: SpotifyArtists[]
  }
}

type AudioDbArtist = {
  strArtistFanart?: string
}

type AudioDbArtistResponse = {
  artists?: AudioDbArtist[] | null
}

export type ArtistSlice = {
  query: string
  searchLoading: boolean
  searchError: string | null
  searchResults: SpotifyArtists[]
  artist: SpotifyArtist | null
  artistBanner: string
  setQuery: (query: string) => void
  searchArtist: (query: string) => Promise<void>
  getArtist: (id: string) => Promise<void>
}

export const createArtistSlice: StateCreator<ArtistSlice> = (set) => ({
  query: "",
  searchLoading: false,
  searchError: null,
  searchResults: [],
  artist: null,
  artistBanner: "",
  setQuery: (query) => set({ query }),
  searchArtist: async (query) => {
    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      set({
        searchResults: [],
        searchError: "Enter an artist name to search.",
      })
      return
    }

    set({
      searchLoading: true,
      searchError: null,
    })

    try {
      const { data } = await searchArtists(trimmedQuery)
      const artists = (data as SpotifySearchResponse).artists?.items ?? []

      set({
        searchResults: artists,
        searchError: artists.length ? null : "No artists matched your search.",
      })
    } catch (error) {
      set({
        searchResults: [],
        searchError:
          error instanceof Error ? error.message : "Spotify search failed.",
      })
    } finally {
      set({ searchLoading: false })
    }
  },
  getArtist: async (id: string) => {
    set({
      searchLoading: true,
      searchError: null,
    })

    try {
      const { data: artist } = await getArtist(id)
      const { data: bannerData } = await getArtistBanner(artist.name)
      const artistBanner =
        (bannerData as AudioDbArtistResponse).artists?.[0]?.strArtistFanart || ""

      set({
        artist,
        artistBanner,
      })
    } catch (error) {
      set({
        artist: null,
        artistBanner: "",
        searchError:
          error instanceof Error ? error.message : "Loading artist failed.",
      })
    } finally {
      set({ searchLoading: false })
    }
  },
})
