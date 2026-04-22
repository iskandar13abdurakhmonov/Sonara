import { instance } from "@/lib/api"
import axios from "axios"

export const searchArtists = async (query: string) => {
  return await instance.get('/search', {
    params: {
      q: query,
      type: 'artist',
      limit: 10
    }
  })
}

export const getArtistBanner = async (query: string) => {
  return await axios.get(
    `https://www.theaudiodb.com/api/v1/json/123/search.php?`,
    {
      params: {
        s: query
      }
    }
  )
}

export const getArtist = async (id: string) => {
  return await instance.get(`/artists/${id}`)
}

export const getArtistTopTracks = async (id: string) => {
  return await instance.get(`/artists/${id}/top-tracks`)
}

export const getArtistAlbums = async (
  id: string,
  includeGroups = "album",
  market = "US",
  limit = 8,
  offset = 0,
) => {
  return await instance.get(`/artists/${id}/albums`, {
    params: {
      include_groups: includeGroups,
      market,
      limit,
      offset,
    },
  })
}
