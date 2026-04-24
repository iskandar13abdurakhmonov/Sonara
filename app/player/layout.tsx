import React, { ReactNode } from "react"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import AppSidebar from "@/components/AppSidebar"
import PlayerBar from "@/components/PlayerBar"

export default function PlayerLayout({children} : { children: ReactNode}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "16rem",
          "--sidebar-width-mobile": "20rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset className="h-svh overflow-hidden bg-[radial-gradient(circle_at_top,_hsl(var(--muted))_0%,_transparent_34%),linear-gradient(180deg,_hsl(var(--background))_0%,_hsl(var(--muted)/0.45)_100%)]">
        <div className="flex h-full min-h-0 flex-col">
          <header className="sticky top-0 z-20 flex h-17 items-center border-b border-border/60 bg-background/75 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-3 rounded-full bg-muted/80 p-1 ring-1 ring-border/70">
              <SidebarTrigger size="icon-lg" className="rounded-full" />
            </div>
          </header>
          <main className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto flex min-h-full w-full max-w-[1800px] flex-col px-4 pb-28 pt-4 md:px-6">
              <div className="flex-1 rounded-[28px] border border-border/60 bg-[linear-gradient(180deg,hsl(var(--card))_0%,hsl(var(--background))_100%)] p-4 shadow-[0_20px_80px_-40px_rgba(15,23,42,0.28)] backdrop-blur md:p-6">
                {children}
              </div>
            </div>
          </main>
          <PlayerBar />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
