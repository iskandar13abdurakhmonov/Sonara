"use client"

import Link from "next/link"
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react"
import { SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AUTH_STORAGE_KEY, type SonaraAuthResult } from "@/lib/auth"

type StoredAuth = SonaraAuthResult & {
  received_at?: string
  nextPath?: string
}

type SpotifyArtist = {
  id: string
  name: string
  genres?: string[]
  popularity?: number
  followers?: {
    total?: number
  }
  images?: Array<{
    url: string
  }>
  external_urls?: {
    spotify?: string
  }
}

type SpotifySearchResponse = {
  artists?: {
    items?: SpotifyArtist[]
  }
}

export default function Page() {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<SpotifyArtist[]>([])

  useEffect(() => {
    const storedAuth = window.sessionStorage.getItem(AUTH_STORAGE_KEY)

    if (!storedAuth) {
      setLoading(false)
      return
    }

    try {
      const parsedAuth = JSON.parse(storedAuth) as StoredAuth
      setAccessToken(parsedAuth.access_token || null)
    } catch {
      setSearchError("Stored sign-in data is invalid.")
    } finally {
      setLoading(false)
    }
  }, [])

  function handleQueryChange(e: ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value)

    if (searchError) {
      setSearchError(null)
    }
  }

  async function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      setSearchResults([])
      setSearchError("Enter an artist name to search.")
      return
    }

    if (!accessToken) {
      setSearchResults([])
      setSearchError("You need to sign in before searching Spotify.")
      return
    }

    setSearchLoading(true)
    setSearchError(null)

    try {
      const encodedQuery = encodeURIComponent(trimmedQuery)
      const res = await fetch(
        `https://api.spotify.com/v1/search?q=${encodedQuery}&type=artist&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      if (!res.ok) {
        throw new Error(`Spotify search failed with ${res.status}`)
      }

      const data = (await res.json()) as SpotifySearchResponse
      const artists = data.artists?.items ?? []

      setSearchResults(artists)

      if (!artists.length) {
        setSearchError("No artists matched your search.")
      }
    } catch (searchFetchError: unknown) {
      setSearchResults([])
      setSearchError(
        searchFetchError instanceof Error
          ? searchFetchError.message
          : "Spotify search failed.",
      )
    } finally {
      setSearchLoading(false)
    }
  }

  return (
        <section>
          <form onSubmit={handleSearch}>
            <div className="flex gap-3">
              <Input
                placeholder="Search artists..."
                value={query}
                onChange={handleQueryChange}
                disabled={!accessToken || searchLoading}
              />
              <Button
                variant="outline"
                size="icon"
                type="submit"
                disabled={!accessToken || searchLoading}
                className="border-white/15 bg-white text-slate-950 hover:bg-cyan-50"
              >
                <SearchIcon />
              </Button>
            </div>
          </form>

          {loading ? (
            <p className="mt-6 text-sm text-cyan-50/80">Checking session...</p>
          ) : !accessToken ? (
            <div className="mt-6 space-y-4">
              <p className="text-sm leading-6 text-cyan-50/80">
                Sign in first to search Spotify artists.
              </p>
              <Button
                asChild
                className="h-11 rounded-full bg-white text-slate-950 hover:bg-cyan-50"
              >
                <Link href="/auth/sign-in?next=/player">Go to Sign In</Link>
              </Button>
            </div>
          ) : null}

          {searchError ? (
            <p className="mt-6 text-sm text-rose-100/90">{searchError}</p>
          ) : null}

          {searchLoading ? (
            <p className="mt-6 text-sm text-cyan-50/80">Searching Spotify...</p>
          ) : searchResults.length ? (
            <div className="mt-6 grid gap-4">
              {searchResults.map((artist) => {
                const artistImageUrl = artist.images?.[0]?.url

                return (
                  <article
                    key={artist.id}
                    className="flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-slate-950/30 p-5 sm:flex-row sm:items-center"
                  >
                    <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-cyan-400/20 text-2xl font-semibold text-cyan-100">
                      {artistImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={artistImageUrl}
                          alt={artist.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        artist.name.slice(0, 1).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <h2 className="text-2xl font-semibold">{artist.name}</h2>
                      <div className="grid gap-1 text-sm text-cyan-50/80 sm:grid-cols-2">
                        <p>
                          Followers:{" "}
                          <span className="font-mono text-cyan-100">
                            {artist.followers?.total ?? "unknown"}
                          </span>
                        </p>
                        <p>
                          Popularity:{" "}
                          <span className="font-mono text-cyan-100">
                            {artist.popularity ?? "unknown"}
                          </span>
                        </p>
                        <p className="sm:col-span-2">
                          Genres:{" "}
                          <span className="font-mono text-cyan-100">
                            {artist.genres?.length
                              ? artist.genres.join(", ")
                              : "not provided"}
                          </span>
                        </p>
                      </div>
                    </div>
                    {artist.external_urls?.spotify ? (
                      <Button
                        asChild
                        className="h-11 rounded-full bg-white text-slate-950 hover:bg-cyan-50"
                      >
                        <Link href={artist.external_urls.spotify} target="_blank">
                          Open
                        </Link>
                      </Button>
                    ) : null}
                  </article>
                )
              })}
            </div>
          ) : null}
        </section>
  )
}
