import { create } from "zustand"
import { createArtistSlice, type ArtistSlice } from "@/store/ArtistSlice"
import { createProfileSlice, type ProfileSlice } from "@/store/ProfileSlice"
import { AlbumSlice, createAlbumSlice } from "@/store/AlbumSlice"
import { createPlayerSlice, type PlayerSlice } from "@/store/PlayerSlice"

type GlobalStore = ArtistSlice & ProfileSlice & AlbumSlice & PlayerSlice

export const useGlobalStore = create<GlobalStore>()((...args) => ({
  ...createArtistSlice(...args),
  ...createProfileSlice(...args),
  ...createAlbumSlice(...args),
  ...createPlayerSlice(...args),
}))
