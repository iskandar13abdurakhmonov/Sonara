import { create } from "zustand"
import { createArtistSlice, type ArtistSlice } from "@/store/ArtistSlice"

export const useGlobalStore = create<ArtistSlice>()((...args) => ({
  ...createArtistSlice(...args),
}))
