import React, { ReactNode } from "react"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import AppSidebar from "@/components/AppSidebar"

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
      <SidebarInset className="min-h-0 min-w-0">
        <SidebarTrigger size="icon-lg" className="mt-2 ml-2"/>
        <main className="flex min-h-0 flex-1 justify-center">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}