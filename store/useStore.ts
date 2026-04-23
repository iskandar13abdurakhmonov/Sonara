import { create } from "zustand"
import { createArtistSlice, type ArtistSlice } from "@/store/ArtistSlice"
import { createProfileSlice, type ProfileSlice } from "@/store/ProfileSlice"
import { AlbumSlice, createAlbumSlice } from "@/store/AlbumSlice"

type GlobalStore = ArtistSlice & ProfileSlice & AlbumSlice

export const useGlobalStore = create<GlobalStore>()((...args) => ({
  ...createArtistSlice(...args),
  ...createProfileSlice(...args),
  ...createAlbumSlice(...args)
}))
