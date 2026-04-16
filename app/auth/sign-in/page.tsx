import Link from "next/link"
import { Button } from "@/components/ui/button"
import { buildSonaraSignInUrl, getSonaraApiUrl } from "@/lib/auth"

type SignInPageProps = {
  searchParams?: Promise<{
    next?: string
  }>
}

export default async function Page({ searchParams }: SignInPageProps) {
  const params = searchParams ? await searchParams : undefined
  const nextPath = params?.next || "/"
  const signInUrl = buildSonaraSignInUrl(nextPath)
  const apiUrl = getSonaraApiUrl()

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.3),_transparent_34%),linear-gradient(135deg,_#111827_0%,_#172554_42%,_#0f766e_100%)] px-6 py-16 text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
      <section className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/15 bg-white/10 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.32em] text-cyan-100/70">Sonara</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance">
          Sign in to your sound space.
        </h1>
        <p className="mt-4 text-sm leading-6 text-cyan-50/80">
          Continue with the Sonara backend authentication flow and return to{" "}
          <span className="font-mono text-cyan-100">{nextPath}</span> when it
          completes.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Button
            asChild
            className="h-11 rounded-full bg-white text-slate-950 hover:bg-cyan-50"
          >
            <Link href={signInUrl} prefetch={false}>
              Continue to Sign In
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="h-11 rounded-full border border-white/20 text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
        <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/20 p-4 text-xs leading-6 text-cyan-50/75">
          <p>
            Backend login endpoint:{" "}
            <span className="font-mono text-cyan-100">{apiUrl}/auth/login</span>
          </p>
          <p>
            Override with{" "}
            <span className="font-mono text-cyan-100">
              NEXT_PUBLIC_SONARA_API_URL
            </span>
            .
          </p>
        </div>
      </section>
    </main>
  )
}
