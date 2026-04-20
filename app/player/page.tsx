"use client"

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
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

export default function Page() {

  const router = useRouter()

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

  const handleViewArtist = (id: string) => {
    router.push(`/player/${id}`)
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
            className="bg-white hover:bg-cyan-50"
          >
            <SearchIcon />
          </Button>
        </div>
      </form>

      <div className="grid grid-cols-6 gap-4 mt-4">
        {
          searchResults.map((artist: SpotifyArtist) => {
            const artistImageUrl = artist.images?.[0]?.url

            return (
              <Card key={artist.id} className="relative mx-auto w-full max-w-sm pt-0">
                <div className="absolute inset-0 z-30 aspect-square" />
                <Image
                  src={artistImageUrl || null}
                  alt={artist.name}
                  width="90"
                  height="80"
                  quality={100}
                  sizes="100"
                  className="relative z-20 aspect-square w-full object-contain"
                />
                <CardHeader>
                  <CardAction>
                    <Badge variant="secondary">{artist.type}</Badge>
                  </CardAction>
                  <CardTitle>{artist.name}</CardTitle>
                  {/*<CardDescription>*/}
                  {/*  A practical talk on component APIs, accessibility, and*/}
                  {/*  shipping faster.*/}
                  {/*</CardDescription>*/}
                </CardHeader>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleViewArtist(artist.id)}>View Artist</Button>
                </CardFooter>
              </Card>
            )
          })
        }
      </div>
    </section>
  )
}
