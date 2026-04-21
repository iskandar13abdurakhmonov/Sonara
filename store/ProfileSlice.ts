import { StateCreator } from "zustand"
import { getProfile } from "@/lib/ProfileService"

export type SpotifyProfile = {
  country: string
  display_name: string
  email: string
  explicit_content: {
    filter_enabled: boolean
    filter_locked: boolean
  }
  external_urls: {
    spotify: string
  }
  followers: {
    href: string
    total: number
  }
  href: string
  id: string
  images: Array<{
    url: string
    height: number
    width: number
  }>
  product: string
  type: string
  uri: string
}

export type ProfileSlice = {
  profile: SpotifyProfile
  getProfile: () => Promise<SpotifyProfile | null>
}

export const createProfileSlice: StateCreator<ProfileSlice> = (set) => ({
  profile: {
    country: "",
    display_name: "",
    email: "",
    explicit_content: {
      filter_enabled: false,
      filter_locked: false,
    },
    external_urls: {
      spotify: "",
    },
    followers: {
      href: "",
      total: 0,
    },
    href: "",
    id: "",
    images: [],
    product: "",
    type: "",
    uri: "",
  },
  getProfile: async () => {
    try {
      const { data } = await getProfile()

      set({
        profile: data,
      })

      return data
    } catch (error) {
      return null
    }
  },
})
