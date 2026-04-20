"use client"

import { useEffect, use } from "react" // Import 'use'
import { useGlobalStore } from "@/store/useStore"

// 1. Remove 'async'
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  // 2. Unwrap the params promise using the 'use' hook
  const { id } = use(params)

  const getArtist = useGlobalStore((state) => state.getArtist)
  const artist = useGlobalStore((state) => state.artist)

  useEffect(() => {
    if (id) {
      getArtist(id)
    }
  }, [id, getArtist])

  return <pre>{artist ? JSON.stringify(artist, null, 2) : "Loading..."}</pre>
}
