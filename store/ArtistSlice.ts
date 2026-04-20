import type { StateCreator } from "zustand"
import { getArtist, searchArtists } from "@/lib/artistService"

export type SpotifyArtist = {
  id: string
  name: string
  genres?: string[]
  popularity?: number
  type: string;
  followers?: {
    total?: number
  }
  images?: Array<{
    url: string,
    width: number,
    height: number
  }>
  external_urls?: {
    spotify?: string
  }
}

type SpotifySearchResponse = {
  artists?: {
    items?: SpotifyArtist[]
  }
}

export type ArtistSlice = {
  query: string
  searchLoading: boolean
  searchError: string | null
  searchResults: SpotifyArtist[]
  artist: SpotifyArtist
  setQuery: (query: string) => void
  searchArtist: (query: string) => Promise<void>
  getArtist: (id: string) => Promise<void>
}

export const createArtistSlice: StateCreator<ArtistSlice> = (set) => ({
  query: "",
  searchLoading: false,
  searchError: null,
  searchResults: [],
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
    try {
      const { data } = await getArtist(id)

      set({
        artist: data
      })
    } catch (error) {
      set({
        artist: []
      })
    } finally {
      set({ searchLoading: false })
    }
  }
})
