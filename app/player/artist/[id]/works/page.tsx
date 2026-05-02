"use client"

import { use, useEffect } from "react"
import { useGlobalStore } from "@/store/useStore"
import { getArtistAlbums } from "@/lib/artistService"

export default function Page({ params }: { params: Promise<{ id: string }> }) {

  const { id } = use(params)
  const artistAlbums = useGlobalStore((state) => state.getArtistAlbums)

  useEffect(() => {
    getArtistAlbums(id, '', 'US' )
  }, [id, artistAlbums])

  return(
    <div>
      id: { id }
    </div>
  )
}