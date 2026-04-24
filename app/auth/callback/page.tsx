"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DEFAULT_POST_LOGIN_PATH,
  persistAuth,
  type SonaraAuthResult,
} from "@/lib/auth"

export default function AuthCallbackPage() {
  const router = useRouter()
  const [authResult, setAuthResult] = useState<SonaraAuthResult | null>(null)
  const [nextPath, setNextPath] = useState(DEFAULT_POST_LOGIN_PATH)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const nextParam = params.get("next")
    const parsedNextPath =
      nextParam && nextParam.startsWith("/") ? nextParam : DEFAULT_POST_LOGIN_PATH
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""))

    setNextPath(parsedNextPath)
    setAuthResult({
      access_token: hashParams.get("access_token") || undefined,
      refresh_token: hashParams.get("refresh_token") || undefined,
      expires_in: hashParams.get("expires_in") || undefined,
      scope: hashParams.get("scope") || undefined,
      token_type: hashParams.get("token_type") || undefined,
      error: hashParams.get("error") || undefined,
      message: hashParams.get("message") || undefined,
      details: hashParams.get("details") || undefined,
    })
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (authResult?.access_token) {
      persistAuth({
        ...authResult,
        nextPath,
      })

      const timeoutId = window.setTimeout(() => {
        router.replace(nextPath)
      }, 900)

      return () => {
        window.clearTimeout(timeoutId)
      }
    }
  }, [authResult, nextPath, router])

  if (!isHydrated) {
    return (
      <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.3),_transparent_34%),linear-gradient(135deg,_#0f172a_0%,_#1d4ed8_38%,_#0f766e_100%)] px-6 py-16 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
        <section className="relative z-10 w-full max-w-xl rounded-[2rem] border border-white/15 bg-white/10 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.32em] text-cyan-100/70">
            Sonara
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance">
            Completing Spotify sign-in...
          </h1>
          <p className="mt-4 text-sm leading-6 text-cyan-50/80">
            Finishing the authorization flow.
          </p>
        </section>
      </main>
    )
  }

  const isSuccess = Boolean(authResult?.access_token) && !authResult?.error
  const redirecting = isSuccess

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.3),_transparent_34%),linear-gradient(135deg,_#0f172a_0%,_#1d4ed8_38%,_#0f766e_100%)] px-6 py-16 text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
      <section className="relative z-10 w-full max-w-xl rounded-[2rem] border border-white/15 bg-white/10 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.32em] text-cyan-100/70">
          Sonara
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance">
          {isSuccess ? "Spotify connected." : "Spotify sign-in failed."}
        </h1>
        <p className="mt-4 text-sm leading-6 text-cyan-50/80">
          {isSuccess
            ? redirecting
              ? "Authorization completed. Redirecting you into the app now."
              : "The backend completed the authorization flow and returned tokens to the frontend callback."
            : authResult?.message || "The Spotify authorization flow did not complete successfully."}
        </p>
        <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/20 p-4 text-xs leading-6 text-cyan-50/75">
          {isSuccess ? (
            <>
              <p>
                Token type:{" "}
                <span className="font-mono text-cyan-100">
                  {authResult?.token_type || "Bearer"}
                </span>
              </p>
              <p>
                Expires in:{" "}
                <span className="font-mono text-cyan-100">
                  {authResult?.expires_in || "unknown"} seconds
                </span>
              </p>
              <p>
                Scope:{" "}
                <span className="font-mono text-cyan-100 break-all">
                  {authResult?.scope || "not provided"}
                </span>
              </p>
            </>
          ) : (
            <>
              <p>
                Error:{" "}
                <span className="font-mono text-rose-200">
                  {authResult?.error || "unknown_error"}
                </span>
              </p>
              {authResult?.details ? (
                <p className="break-all">
                  Details:{" "}
                  <span className="font-mono text-rose-100">
                    {authResult.details}
                  </span>
                </p>
              ) : null}
            </>
          )}
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            className="h-11 rounded-full bg-white text-slate-950 hover:bg-cyan-50"
          >
            <Link href={nextPath}>
              {isSuccess ? "Continue Now" : "Open App"}
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="h-11 rounded-full border border-white/20 text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="/auth/sign-in">Try Again</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
