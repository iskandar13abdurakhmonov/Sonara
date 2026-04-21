import { instance } from "@/lib/api"

export const getProfile = async () => {
  return await instance.get("/me")
}

const buildSpotifyUri = (type: string, id: string) => `spotify:${type}:${id}`

export const getIsFollows = async (type: string, ids: string) => {
  return await instance.get("/me/library/contains", {
    params: {
      uris: buildSpotifyUri(type, ids),
    },
  })
}

export const followArtist = async (ids: string) => {
  return await instance.put("/me/library", undefined, {
    params: {
      uris: buildSpotifyUri("artist", ids),
    },
  })
}

export const unfollowArtist = async (ids: string) => {
  return await instance.delete("/me/library", {
    params: {
      uris: buildSpotifyUri("artist", ids),
    },
  })
}
