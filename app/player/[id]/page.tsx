"use client"

import { useEffect, use, useState } from "react"
import { useGlobalStore } from "@/store/useStore"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { Empty } from "@/components/ui/empty"
import {
  followArtist,
  getIsFollows,
  unfollowArtist,
} from "@/lib/ProfileService"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { CheckIcon, UserRoundPlus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArtistAlbum } from "@/store/ArtistSlice"

type TabsTriggersType = {
  id: number
  title: string,
  value: string
}

const TabTriggers = [
  {
    id: 1,
    title: "Albums",
    value: "album",
  },
  {
    id: 2,
    title: "Singles",
    value: "single",
  },
  {
    id: 3,
    title: "Appears On",
    value: "appears_on",
  },
  {
    id: 4,
    title: "Compilation",
    value: "compilation",
  },
]

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const getArtist = useGlobalStore((state) => state.getArtist)
  const getArtistAlbums = useGlobalStore((state) => state.getArtistAlbums)
  const artist = useGlobalStore((state) => state.artist)
  const albums = useGlobalStore((state) => state.artistAlbums)
  const artistBanner = useGlobalStore((state) => state.artistBanner)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [currentTab, setCurrentTab] = useState("album")

  const imageToDisplay = artist?.images[0]?.url
  const imageDimensions = artist?.images[2] ?? artist?.images[0]

  useEffect(() => {
    if (!id) {
      return
    }

    let isMounted = true

    const loadArtistPage = async () => {
      try {
        await getArtist(id)
        await getArtistAlbums(id, "album", "US", 8, 0)
        const { data } = await getIsFollows("artist", id)

        if (isMounted) {
          setIsFollowing(Boolean(data?.[0]))
        }
      } catch {
        if (isMounted) {
          setIsFollowing(false)
        }
      }
    }

    void loadArtistPage()

    return () => {
      isMounted = false
    }
  }, [id, getArtist, getArtistAlbums])

  const handleFollowToggle = async () => {
    if (!id || followLoading) {
      return
    }

    setFollowLoading(true)

    try {
      if (isFollowing) {
        await unfollowArtist(id)
        setIsFollowing(false)
      } else {
        await followArtist(id)
        setIsFollowing(true)
      }
    } finally {
      setFollowLoading(false)
    }
  }

  const handleTabChange = async (value: string) => {
    setCurrentTab(value)
    await getArtistAlbums(id, value, "US", 8, 0)
  }

  if (!artist) {
    return <Empty />
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="relative h-[500px] w-full">
        {artistBanner ? (
          <>
            <Image
              src={artistBanner}
              alt={artist.name || "Artist banner"}
              fill
              className="rounded-xl object-cover"
              sizes="100"
              quality={100}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </>
        ) : (
          <Skeleton />
        )}
        <div className="absolute bottom-5 left-5 z-20 flex items-center">
          {imageToDisplay && imageDimensions ? (
            <Image
              src={imageToDisplay}
              width={imageDimensions.width}
              height={imageDimensions.height}
              alt={artist.name}
              className="rounded-full object-cover"
            />
          ) : null}
          <div className="ml-2 flex flex-col gap-4">
            <h1 className="text-8xl font-bold">{artist.name}</h1>
            <div>
              <Button
                variant={isFollowing ? "success" : "default"}
                size="lg"
                onClick={handleFollowToggle}
                disabled={followLoading}
              >
                {followLoading
                  ? isFollowing
                    ? "Unfollowing"
                    : "Following"
                  : isFollowing
                    ? "Following"
                    : "Follow"}
                {followLoading ? (
                  <Spinner data-icon="inline-end" />
                ) : isFollowing ? (
                  <CheckIcon data-icon="inline-end" />
                ) : (
                  <UserRoundPlus data-icon="inline-end" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-bold mb-3">Discography</h2>
        <Tabs value={currentTab} onValueChange={handleTabChange}>
          <TabsList className="w-[400px]">
            {TabTriggers.map((item: TabsTriggersType) => {
              return (
                <TabsTrigger
                  value={item.value}
                  key={item.id}
                >
                  {item.title}
                </TabsTrigger>
              )
            })}
          </TabsList>
          <TabsContent value={currentTab} className="mt-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-8">
              {albums.map((album: ArtistAlbum) => {
                const imageToDisplay = album.images[0]?.url

                return (
                  <Card key={album.id} className="h-full overflow-hidden pt-0">
                    {imageToDisplay ? (
                      <Image
                        src={imageToDisplay}
                        alt={album.name}
                        width={300}
                        height={300}
                        quality={100}
                        sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 12vw"
                        className="aspect-square w-full object-cover"
                      />
                    ) : (
                      <div className="aspect-square w-full bg-muted" />
                    )}
                    <CardHeader className="min-h-20">
                      <CardTitle className="truncate">{album.name}</CardTitle>
                    </CardHeader>
                    <CardFooter className="mt-auto flex items-center justify-between">
                      <CardDescription>{album.release_date.split("-")[0]}</CardDescription>
                      <CardDescription>{album.type}</CardDescription>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
