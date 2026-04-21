import { create } from "zustand"
import { createArtistSlice, type ArtistSlice } from "@/store/ArtistSlice"
import { createProfileSlice, type ProfileSlice } from "@/store/ProfileSlice"

type GlobalStore = ArtistSlice & ProfileSlice

export const useGlobalStore = create<GlobalStore>()((...args) => ({
  ...createArtistSlice(...args),
  ...createProfileSlice(...args),
}))
