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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AudioLinesIcon,
  BadgeCheckIcon,
  BellIcon,
  ChevronsUpDownIcon,
  HeadphonesIcon,
  LogOutIcon,
  HomeIcon,
  LayoutGridIcon,
  LucideIcon,
  SparklesIcon,
  SettingsIcon,
  Volume2Icon,
} from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"
import { useTheme } from "next-themes"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { clearStoredAuth } from "@/lib/auth"
import { useGlobalStore } from "@/store/useStore"

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
    open,
  } = useSidebar()

  const { resolvedTheme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()
  const profile = useGlobalStore((state) => state.profile)
  const getProfile = useGlobalStore((state) => state.getProfile)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!profile.id) {
      void getProfile()
    }
  }, [getProfile, profile.id])

  const logoSrc =
    mounted && resolvedTheme === "dark" ? "/logo-white.svg" : "/logo-black.svg"

  const profileName = profile.display_name || "Your profile"
  const profileEmail = profile.email || "Connect Spotify to load account details"
  const profileInitials = profileName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "SP"
  const profileImage = profile.images[0]?.url

  const handleSignOut = () => {
    clearStoredAuth()
    router.push("/auth/sign-in")
  }

  const mainMenuItems: MenuItem[] = [
    {
      title: "Player",
      url: "/player",
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
            src={logoSrc}
            alt="logo"
            width={50}
            height={50}
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar size="lg">
                    <AvatarImage src={profileImage} alt={profileName} />
                    <AvatarFallback>{profileInitials}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{profileName}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {profileEmail}
                    </span>
                  </div>
                  <ChevronsUpDownIcon className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="end"
                sideOffset={8}
                className="min-w-56 rounded-lg"
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar>
                      <AvatarImage src={profileImage} alt={profileName} />
                      <AvatarFallback>{profileInitials}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{profileName}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {profileEmail}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <SparklesIcon />
                    Upgrade to Pro
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BadgeCheckIcon />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BellIcon />
                    Notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="mailto:iskandar.13.aburahmonov@gmail.com">
                      <HeadphonesIcon />
                      Support
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOutIcon />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail/>
    </Sidebar>
  )
}
