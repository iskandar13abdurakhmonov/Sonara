"use client"

import { use, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useGlobalStore } from "@/store/useStore"
import { Empty } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Clock3Icon, Disc3Icon, ExternalLinkIcon, Music2Icon } from "lucide-react"
import { cn } from "@/lib/utils"

const formatTrackDuration = (durationMs: number) => {
  const totalSeconds = Math.floor(durationMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

const formatReleaseDate = (releaseDate: string) =>
  new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(releaseDate))

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const getAlbum = useGlobalStore((state) => state.getAlbum)
  const album = useGlobalStore((state) => state.album)
  const albumLoading = useGlobalStore((state) => state.albumLoading)
  const requestPlayback = useGlobalStore((state) => state.requestPlayback)

  useEffect(() => {
    if (!id) {
      return
    }

    void getAlbum(id)
  }, [getAlbum, id])

  if (albumLoading && !album) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex gap-6">
          <Skeleton className="size-60 rounded-xl" />
          <div className="flex flex-1 flex-col justify-end gap-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-16 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
          </div>
        </div>
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    )
  }

  if (!album) {
    return <Empty />
  }

  const coverImage = album.images[0]?.url
  const primaryArtist = album.artists[0]
  const totalDurationMs = album.tracks.items.reduce(
    (sum, track) => sum + track.duration_ms,
    0,
  )

  const handleTrackSelect = async (trackIndex: number) => {
    requestPlayback({
      playbackUri: album.uri,
      offset: trackIndex,
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/player">Player</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {primaryArtist ? (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/player/artist/${primaryArtist.id}`}>
                    {primaryArtist.name}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          ) : null}
          <BreadcrumbItem>
            <BreadcrumbPage>{album.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className="relative overflow-hidden rounded-[28px] border border-border bg-muted/40">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={album.name}
            fill
            className="object-cover blur-3xl opacity-25"
            sizes="100vw"
          />
        ) : null}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-background/25" />
        <div className="relative flex flex-col gap-6 p-8 lg:flex-row lg:items-end">
          <Card className="overflow-hidden border-border/70 bg-background/80 p-0 shadow-2xl backdrop-blur">
            <CardContent className="p-0">
              {coverImage ? (
                <Image
                  src={coverImage}
                  alt={album.name}
                  width={320}
                  height={320}
                  quality={100}
                  sizes="320px"
                  className="size-60 object-cover lg:size-80"
                />
              ) : (
                <div className="flex size-60 items-center justify-center bg-muted lg:size-80">
                  <Disc3Icon className="text-muted-foreground" />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-1 flex-col gap-5">
            <Badge variant="secondary" className="w-fit">
              {album.album_type}
            </Badge>
            <div className="flex flex-col gap-3">
              <h1 className="text-5xl font-bold tracking-tight text-balance lg:text-7xl">
                {album.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {primaryArtist ? (
                  <Link
                    href={`/player/artist/${primaryArtist.id}`}
                    className="font-medium text-foreground hover:underline"
                  >
                    {primaryArtist.name}
                  </Link>
                ) : null}
                <span>{formatReleaseDate(album.release_date)}</span>
                <span>{album.total_tracks} tracks</span>
                <span>{formatTrackDuration(totalDurationMs)}</span>
                <span>{album.label}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href={album.external_urls.spotify} target="_blank">
                  <ExternalLinkIcon data-icon="inline-end" />
                  Open in Spotify
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Artists</TableHead>
                  <TableHead className="w-16 text-right">
                    <Clock3Icon className="ml-auto" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {album.tracks.items.map((track, index) => (
                  <TableRow
                    key={track.id}
                    className="cursor-pointer"
                    onClick={() => void handleTrackSelect(index)}
                  >
                    <TableCell className="text-muted-foreground">
                      {track.track_number}
                    </TableCell>
                    <TableCell>
                      <div className="flex min-w-0 flex-col gap-1">
                        <span className="truncate font-medium">{track.name}</span>
                        <div className="flex items-center gap-2 md:hidden">
                          {track.explicit ? (
                            <Badge variant="outline">Explicit</Badge>
                          ) : null}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-muted-foreground">
                          {track.artists.map((artist) => artist.name).join(", ")}
                        </span>
                        {track.explicit ? (
                          <Badge variant="outline">Explicit</Badge>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatTrackDuration(track.duration_ms)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-5 p-6">
            <div className="flex items-center gap-2">
              <Music2Icon className="text-muted-foreground" />
              <h2 className="text-lg font-semibold">Album details</h2>
            </div>
            <Separator />
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium capitalize">{album.album_type}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Release date</span>
                <span className="font-medium">
                  {formatReleaseDate(album.release_date)}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Label</span>
                <span className="font-medium">{album.label}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Popularity</span>
                <span className="font-medium">{album.popularity}/100</span>
              </div>
              {album.copyrights.length ? (
                <div className="flex flex-col gap-2">
                  <span className="text-muted-foreground">Copyright</span>
                  <div className="flex flex-col gap-2">
                    {album.copyrights.map((copyright) => (
                      <p
                        key={`${copyright.type}-${copyright.text}`}
                        className={cn("text-sm leading-6 text-muted-foreground")}
                      >
                        {copyright.text}
                      </p>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
