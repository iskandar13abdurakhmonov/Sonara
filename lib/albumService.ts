import { instance } from "@/lib/api"

export const getAlbum = async (albumId: string) => {
  return await instance.get(`/albums/${albumId}`)
}