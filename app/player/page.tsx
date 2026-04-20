"use client"

import Link from "next/link"
import { type ChangeEvent, type FormEvent } from "react"
import { PlusIcon, SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useGlobalStore } from "@/store/useStore"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { SpotifyArtist } from "@/store/ArtistSlice"
import Image from "next/image"

export default function Page() {
  const query = useGlobalStore((state) => state.query)
  const searchLoading = useGlobalStore((state) => state.searchLoading)
  const searchResults = useGlobalStore((state) => state.searchResults)
  const setQuery = useGlobalStore((state) => state.setQuery)
  const searchArtist = useGlobalStore((state) => state.searchArtist)

  function handleQueryChange(e: ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value)
  }

  async function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    await searchArtist(query)
  }

  return (
    <section className="w-full">
      <form onSubmit={handleSearch} className="w-[300px]">
        <div className="flex gap-3">
          <Input
            placeholder="Search artists..."
            value={query}
            onChange={handleQueryChange}
            disabled={searchLoading}
          />
          <Button
            variant="outline"
            size="icon"
            type="submit"
            disabled={searchLoading}
            className="border-white/15 bg-white text-slate-950 hover:bg-cyan-50"
          >
            <SearchIcon />
          </Button>
        </div>
      </form>

      <ItemGroup className="mt-3">
        {searchResults.map((artist: SpotifyArtist) => {
          const artistImageUrl = artist.images?.[0]?.url

          return (
          <Item key={artist.id} variant="outline">
            <ItemMedia>
                <Image
                  src={artistImageUrl}
                  alt={artist.name}
                  width="80"
                  height="80"
                  className="aspect-square w-full rounded-sm object-cover"
                />
            </ItemMedia>
            <ItemContent className="gap-1">
              <ItemTitle>{artist.name}</ItemTitle>
              <ItemDescription>{artist.type}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant="ghost" size="icon" className="rounded-full">
                <PlusIcon />
              </Button>
            </ItemActions>
          </Item>
        )})}
      </ItemGroup>
    </section>
  )
}
