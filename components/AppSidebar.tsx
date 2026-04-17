"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem, SidebarRail, useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AudioLinesIcon,
  ChevronDown,
  HeadphonesIcon,
  HomeIcon,
  LayoutGridIcon,
  LucideIcon,
  SettingsIcon,
  Volume2Icon,
} from "lucide-react"
import { useEffect } from "react"
import { Image } from "next/dist/client/image-component"
import { useTheme } from "next-themes"
import Link from "next/link"
import { usePathname } from "next/dist/client/components/navigation"

interface MenuItem {
  title: string;
  url?: string;
  icon: LucideIcon;
  onClick?: () => void;
}

interface NavSectionProps {
  label: string
  items: MenuItem[],
  pathname: string
}

function NavSection({ label, items, pathname }: NavSectionProps) {
  return (
    <SidebarGroup>
      {label && (
        <SidebarGroupLabel className="text-[13px] text-muted-foreground uppercase">
          {label}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton
                asChild={!!item.url}
                isActive={
                  item.url
                    ? item.url === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.url)
                    : false
                }
                onClick={item.onClick}
                tooltip={item.title}
                className="h-9 border border-transparent px-3 py-2 text-[13px] font-medium tracking-tight data-[active=true]:border-border data-[active=true]:shadow-[0px_1px_1px_0px_rgba(44,54,53,0.03),inset_0px_0px_0px_2px_white]"
              >
                {item.url ? (
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                ) : (
                  <>
                    <item.icon />
                    <span>{item.title}</span>
                  </>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default function AppSidebar() {

  const {
    isMobile,
    openMobile,
    setOpenMobile,
    open,
    setOpen,
    toggleSidebar,
    state
  } = useSidebar()

  const { theme } = useTheme()
  const pathname = usePathname()

  const mainMenuItems: MenuItem[] = [
    {
      title: "Dashboard",
      url: "/",
      icon: HomeIcon,
    },
    {
      title: "Explore voices",
      url: "/voices",
      icon: LayoutGridIcon,
    },
    {
      title: "Text to speech",
      url: "/text-to-speech",
      icon: AudioLinesIcon,
    },
    {
      title: "Voice cloning",
      icon: Volume2Icon,
    },
  ]

  const othersMenuItems: MenuItem[] = [
    {
      title: "Settings",
      icon: SettingsIcon,
    },
    {
      title: "Help and support",
      url: "mailto:iskandar.13.aburahmonov@gmail.com",
      icon: HeadphonesIcon,
    },
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center">
          <Image
            src="/logo-white.svg"
            alt="logo"
            width="50"
            height="50"
          />
          {open && (
            <span className="ml-2 text-2xl font-bold uppercase">Sonara</span>
          )}
        </div>
      </SidebarHeader>
      <div className="border-b border-solid border-border" />
      <SidebarContent>
        <NavSection
          label="Playlists"
          items={mainMenuItems}
          pathname={pathname}
        />
        <NavSection label="Music" items={othersMenuItems} pathname={pathname} />
      </SidebarContent>
      <SidebarFooter className="gap-3 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            Footer
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail/>
    </Sidebar>
  )
}