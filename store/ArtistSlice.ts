import type { StateCreator } from "zustand"
import {
  getArtist,
  getArtistAlbums,
  getArtistBanner,
  getArtistTopTracks,
  searchArtists,
} from "@/lib/artistService"

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

export type TopTracks = {
  album: {
    album_type: string
    total_tracks: number
    available_markets: string[]
    external_urls: {
      spotify: string
    }
    href: string
    id: string
    images: Array<{
      url: string
      width: number
      height: number
    }>
    name: string
    release_date: string
    release_date_precision: string
    restrictions: {
      reason: string
    }
    type: string
    uri: string
  }
  artists: Array<{
    external_urls: {
      spotify: string
    }
    href: string
    id: string
    name: string
    type: string
    uri: string
  }>
  available_markets: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: {
    isrc: string
    ean: string
    upc: string
  }
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  is_playable: boolean
  restrictions: {
    reason: string
  }
  name: string
  popularity: number
  preview_url: string
  track_number: number
  type: string
  uri: string
  is_local: boolean
}

export type ArtistAlbum = {
  album_type: string
  total_tracks: number
  available_markets: string[]
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  images: Array<{
    url: string
    width: number
    height: number
  }>
  name: string
  release_date: string
  release_date_precision: string
  restrictions: {
    reason: string
  }
  type: string
  uri: string
  artists: Array<{
    external_urls: {
      spotify: string
    }
    href: string
    id: string
    name: string
    type: string
    uri: string
  }>
  album_group: string
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

type ArtistTopTracksResponse = {
  tracks: TopTracks[]
}

type ArtistAlbumsResponse = {
  href: string
  limit: number
  next: string
  offset: number
  previous: string
  total: number
  items: ArtistAlbum[]
}

type CachedArtistDetails = {
  artist: SpotifyArtist
  artistBanner: string
}

const searchCache = new Map<string, SpotifyArtists[]>()
const searchRequests = new Map<string, Promise<void>>()
const artistDetailsCache = new Map<string, CachedArtistDetails>()
const artistDetailsRequests = new Map<string, Promise<void>>()
const artistAlbumsCache = new Map<string, ArtistAlbum[]>()
const artistAlbumsRequests = new Map<string, Promise<void>>()

const getArtistAlbumsCacheKey = (
  id: string,
  includeGroups: string,
  market: string,
  limit: number,
  offset: number,
) => [id, includeGroups, market, limit, offset].join(":")

export type ArtistSlice = {
  query: string
  searchLoading: boolean
  searchError: string | null
  searchResults: SpotifyArtists[]
  artist: SpotifyArtist | null
  artistBanner: string
  artistTopTracks: TopTracks[]
  artistAlbums: ArtistAlbum[]
  setQuery: (query: string) => void
  searchArtist: (query: string) => Promise<void>
  getArtist: (id: string) => Promise<void>
  getArtistTopTracks: (id: string) => Promise<void>
  getArtistAlbums: (
    id: string,
    include_groups?: string,
    market?: string,
    limit?: number,
    offset?: number,
  ) => Promise<void>
}

export const createArtistSlice: StateCreator<ArtistSlice> = (set) => ({
  query: "",
  searchLoading: false,
  searchError: null,
  searchResults: [],
  artist: null,
  artistBanner: "",
  artistTopTracks: [],
  artistAlbums: [],
  setQuery: (query) => set({ query }),
  searchArtist: async (query) => {
    const trimmedQuery = query.trim()
    const cacheKey = trimmedQuery.toLowerCase()

    if (!trimmedQuery) {
      set({
        searchResults: [],
        searchError: "Enter an artist name to search.",
      })
      return
    }

    const cachedSearchResults = searchCache.get(cacheKey)

    if (cachedSearchResults) {
      set({
        searchResults: cachedSearchResults,
        searchError: cachedSearchResults.length
          ? null
          : "No artists matched your search.",
      })
      return
    }

    const existingSearchRequest = searchRequests.get(cacheKey)

    if (existingSearchRequest) {
      return existingSearchRequest
    }

    set({
      searchLoading: true,
      searchError: null,
    })

    const searchRequest = (async () => {
      try {
        const { data } = await searchArtists(trimmedQuery)
        const artists = (data as SpotifySearchResponse).artists?.items ?? []

        searchCache.set(cacheKey, artists)

        set({
          searchResults: artists,
          searchError: artists.length ? null : "No artists matched your search.",
        })
      } catch (error) {
        const errorMessage =
          typeof error === "object" &&
          error !== null &&
          "response" in error &&
          typeof error.response === "object" &&
          error.response !== null &&
          "data" in error.response
            ? JSON.stringify(error.response.data)
            : error instanceof Error
              ? error.message
              : "Spotify search failed."

        set({
          searchResults: [],
          searchError: errorMessage,
        })
      } finally {
        searchRequests.delete(cacheKey)
        set({ searchLoading: false })
      }
    })()

    searchRequests.set(cacheKey, searchRequest)

    return searchRequest
  },
  getArtist: async (id: string) => {
    const cachedArtistDetails = artistDetailsCache.get(id)

    if (cachedArtistDetails) {
      set(cachedArtistDetails)
      return
    }

    const existingArtistDetailsRequest = artistDetailsRequests.get(id)

    if (existingArtistDetailsRequest) {
      return existingArtistDetailsRequest
    }

    set({
      searchLoading: true,
      searchError: null,
    })

    const artistDetailsRequest = (async () => {
      try {
        const { data: artist } = await getArtist(id)
        const { data: bannerData } = await getArtistBanner(artist.name)
        const artistBanner =
          (bannerData as AudioDbArtistResponse).artists?.[0]?.strArtistFanart ||
          ""
        const nextArtistDetails = {
          artist,
          artistBanner,
        }

        artistDetailsCache.set(id, nextArtistDetails)
        set(nextArtistDetails)
      } catch (error) {
        set({
          artist: null,
          artistBanner: "",
          searchError:
            error instanceof Error ? error.message : "Loading artist failed.",
        })
      } finally {
        artistDetailsRequests.delete(id)
        set({ searchLoading: false })
      }
    })()

    artistDetailsRequests.set(id, artistDetailsRequest)

    return artistDetailsRequest
  },
  getArtistTopTracks: async (id: string) => {
    set({
      searchLoading: true,
      searchError: null,
    })

    try {
      const { data } = await getArtistTopTracks(id)
      const tracks = await (data as ArtistTopTracksResponse).tracks

      set({
        artistTopTracks: tracks
      })
    } catch (error) {
      set({
        artistTopTracks: []
      })
    } finally {
      set({ searchLoading: false})
    }
  },
  getArtistAlbums: async (
    id: string,
    include_groups = "album",
    market = "US",
    limit = 8,
    offset = 0,
  ) => {
    const cacheKey = getArtistAlbumsCacheKey(
      id,
      include_groups,
      market,
      limit,
      offset,
    )
    const cachedArtistAlbums = artistAlbumsCache.get(cacheKey)

    if (cachedArtistAlbums) {
      set({ artistAlbums: cachedArtistAlbums })
      return
    }

    const existingArtistAlbumsRequest = artistAlbumsRequests.get(cacheKey)

    if (existingArtistAlbumsRequest) {
      return existingArtistAlbumsRequest
    }

    set({
      searchLoading: true,
      searchError: null,
    })

    const artistAlbumsRequest = (async () => {
      try {
        const { data } = await getArtistAlbums(
          id,
          include_groups,
          market,
          limit,
          offset,
        )
        const albums = (data as ArtistAlbumsResponse).items

        artistAlbumsCache.set(cacheKey, albums)
        set({
          artistAlbums: albums,
        })
      } catch (error) {
        set({
          artistAlbums: [],
        })
      } finally {
        artistAlbumsRequests.delete(cacheKey)
        set({ searchLoading: false })
      }
    })()

    artistAlbumsRequests.set(cacheKey, artistAlbumsRequest)

    return artistAlbumsRequest
  },
})
