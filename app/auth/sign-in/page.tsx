import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  DEFAULT_POST_LOGIN_PATH,
  DEFAULT_SONARA_API_URL,
  DEFAULT_SONARA_APP_URL,
} from "@/lib/auth"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type SignInPageProps = {
  searchParams?: Promise<{
    next?: string
  }>
}

export default async function Page({ searchParams }: SignInPageProps) {
  const params = searchParams ? await searchParams : undefined
  const nextPath =
    params?.next && params.next.startsWith("/")
      ? params.next
      : DEFAULT_POST_LOGIN_PATH
  const apiUrl = new URL(
    process.env.NEXT_PUBLIC_SONARA_API_URL?.trim() || DEFAULT_SONARA_API_URL,
  )
  const appUrl = new URL(
    process.env.NEXT_PUBLIC_SONARA_APP_URL?.trim() || DEFAULT_SONARA_APP_URL,
  )

  apiUrl.pathname = "/auth/login"
  apiUrl.search = ""
  apiUrl.hash = ""

  appUrl.pathname = "/auth/callback"
  appUrl.search = ""
  appUrl.hash = ""
  appUrl.searchParams.set("next", nextPath)

  apiUrl.searchParams.set("return_to", appUrl.toString())

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign in to your sound space.</CardTitle>
          <CardDescription>
            Continue with the Sonara backend authentication flow and return to
            /player when it completes.
          </CardDescription>
          <CardAction>
            <Image src="/logo-white.svg" alt="logo" width={80} height={80} />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col gap-2">
          <Button className="w-full">
            <Link href={apiUrl.toString()} prefetch={false}>
              Continue to Sign In
            </Link>
          </Button>
          <Button variant="outline" className="w-full">
            <Link href="/">Back to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
