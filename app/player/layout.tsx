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
      <SidebarInset className="mx-7 my-3">
        <SidebarTrigger size="icon-lg"/>
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}