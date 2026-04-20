"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import ColorBends from "@/components/ColorBends"

export default function Page() {
  return (
    <main>
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
        transparent={true}
        autoRotate={0}
        color="#A855F7"
      />
      <div className="absolute left-80 top-80 text-center">
        <div className="align-center flex justify-center text-center">
          <Image
            src="/logo-green.svg"
            alt="logo"
            width={60}
            height={60}
            className="mr-2"
          />
          <p className="mb-2 text-5xl font-medium text-[#30ce63]">Sonara</p>
        </div>
        <h1 className="mb-10 text-6xl font-bold text-[#30ce63]">
          Feel the sound. Enter your listening session.
        </h1>
        <Button
          variant="outline"
          size="lg"
          className="border-[#30ce63] bg-[#30ce63]"
        >
          <Link href="auth/sign-in?next=/player" className="text-[#30ce63]">
            Let's Start
          </Link>
        </Button>
      </div>
    </main>
  )
}
