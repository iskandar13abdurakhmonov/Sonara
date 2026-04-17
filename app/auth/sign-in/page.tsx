import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DEFAULT_POST_LOGIN_PATH,
  buildSonaraSignInUrl,
  getSonaraApiUrl,
} from "@/lib/auth"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Image } from "next/dist/client/image-component"

type SignInPageProps = {
  searchParams?: Promise<{
    next?: string
  }>
}

export default async function Page({ searchParams }: SignInPageProps) {
  const params = searchParams ? await searchParams : undefined
  const nextPath = params?.next || DEFAULT_POST_LOGIN_PATH
  const signInUrl = buildSonaraSignInUrl(nextPath)
  const apiUrl = getSonaraApiUrl()

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
            <Image
              src="/logo-white.svg"
              alt="logo"
              width="80"
              height="80"
            />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col gap-2">
          <Button className="w-full">
            <Link href={signInUrl} prefetch={false}>
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
