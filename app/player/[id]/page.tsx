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

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const getArtist = useGlobalStore((state) => state.getArtist)
  const artist = useGlobalStore((state) => state.artist)
  const artistBanner = useGlobalStore((state) => state.artistBanner)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)

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
  }, [id, getArtist])

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
      <pre>{JSON.stringify(artist, null, 2)}</pre>
    </div>
  )
}
