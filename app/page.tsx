"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import ColorBends from "@/components/ColorBends"
import Aurora from "@/components/Aurora"
import { Image } from "next/dist/client/image-component"

export default function Page() {
  return (
    <main>
      {/*<div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.22),_transparent_65%)]" />*/}
      {/*<section className="relative mx-auto flex w-full max-w-5xl flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">*/}
      {/*  <div className="max-w-2xl">*/}
      {/*    <p className="text-sm uppercase tracking-[0.3em] text-sky-700">*/}
      {/*      Sonara*/}
      {/*    </p>*/}
      {/*    <h1 className="mt-5 text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">*/}
      {/*      Feel the sound. Enter your listening session.*/}
      {/*    </h1>*/}
      {/*    <p className="mt-6 max-w-xl text-lg leading-8 text-slate-700">*/}
      {/*      This frontend now routes sign-in through the Sonara backend so the*/}
      {/*      browser can complete the authentication redirect flow correctly.*/}
      {/*    </p>*/}
      {/*  </div>*/}
      {/*  <div className="flex w-full max-w-sm flex-col gap-4 rounded-[2rem] border border-sky-200/70 bg-white/75 p-6 shadow-xl shadow-sky-950/10 backdrop-blur">*/}
      {/*    <p className="text-sm leading-6 text-slate-600">*/}
      {/*      Start with the dedicated auth screen. It forwards users to the*/}
      {/*      backend login endpoint and preserves the return path.*/}
      {/*    </p>*/}
      {/*    <Button asChild className="h-11 rounded-full">*/}
      {/*      <Link href="/auth/sign-in?next=/player">Open Sign In</Link>*/}
      {/*    </Button>*/}
      {/*  </div>*/}
      {/*</section>*/}

      <ColorBends
        colors={["#FFFFFF", "#7B8A80", "#000000"]}
        rotation={90}
        speed={0.2}
        scale={1}
        frequency={1}
        warpStrength={1}
        mouseInfluence={1}
        noise={0.15}
        parallax={0.5}
        iterations={1}
        intensity={1.5}
        bandWidth={6}
        transparent
        autoRotate={0}
        color="#A855F7"
      />
      {/*<Aurora*/}
      {/*  colorStops={["#FFFFFF", "#7B8A80", "#000000"]}*/}
      {/*  blend={0.5}*/}
      {/*  amplitude={1.0}*/}
      {/*  speed={1}*/}
      {/*/>*/}
      <div className="absolute top-80 left-80 text-center">
        <div className="align-center flex justify-center text-center">
          <Image
            src="/logo-green.svg"
            alt="logo"
            width="60"
            height="60"
            className="mr-2"
          />
          <p className="mb-2 text-5xl font-medium text-[#30ce63]">Sonara</p>
        </div>
        <h1 className="mb-10 text-6xl font-bold text-[#30ce63]">
          Feel the sound. Enter your listening session.
        </h1>
        <Button variant="outline" size="lg" className="bg-[#30ce63] border-[#30ce63]">
          <Link href="auth/sign-in?next=/player" className="text-[#30ce63]">
            Let's Start
          </Link>
        </Button>
      </div>
    </main>
  )
}
