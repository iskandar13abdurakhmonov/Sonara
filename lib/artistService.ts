import { instance } from "@/lib/api"

export const searchArtists = async (query: string) => {
  return await instance.get('/search', {
    params: {
      q: query,
      type: 'artist',
      limit: 10
    }
  })
}

export const getArtist = async (id: string) => {
  return await instance.get(`/artists/${id}`)
}