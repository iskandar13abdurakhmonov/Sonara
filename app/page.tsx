import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <main className="relative flex min-h-svh items-center overflow-hidden bg-[linear-gradient(180deg,_#f8fafc_0%,_#dbeafe_48%,_#ecfeff_100%)] px-6 py-16">
      <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.22),_transparent_65%)]" />
      <section className="relative mx-auto flex w-full max-w-5xl flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-700">
            Sonara
          </p>
          <h1 className="mt-5 text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
            Feel the sound. Enter your listening session.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-700">
            This frontend now routes sign-in through the Sonara backend so the
            browser can complete the authentication redirect flow correctly.
          </p>
        </div>
        <div className="flex w-full max-w-sm flex-col gap-4 rounded-[2rem] border border-sky-200/70 bg-white/75 p-6 shadow-xl shadow-sky-950/10 backdrop-blur">
          <p className="text-sm leading-6 text-slate-600">
            Start with the dedicated auth screen. It forwards users to the
            backend login endpoint and preserves the return path.
          </p>
          <Button asChild className="h-11 rounded-full">
            <Link href="/auth/sign-in">Open Sign In</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
