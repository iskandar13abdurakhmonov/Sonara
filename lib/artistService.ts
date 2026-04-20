import { instance } from "@/lib/api"

export const getArtists = async (query: string) => {
  return await instance.get('/search', {
    params: {
      q: query,
      type: 'artist',
      limit: 10
    }
  })
}