"use client"
import { logout } from "@/app/(auth)/actions"
import { useSession } from "@/app/(main)/SessionProvider"
import logoutImage from '@/assets/logout.png'
import nightImage from '@/assets/night.png'
import sunImage from '@/assets/sun.png'
import themeImage from '@/assets/theme.png'
import userImage from '@/assets/user.png'
import { useQueryClient } from "@tanstack/react-query"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"
import { useTransition } from "react"
import LoadingGlobal from "./LoadingGlobal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "./ui/dropdown-menu"
import UserAvatar from "./userAvatar"

interface props {
  className?: string
}

export default function UserButton({ }: props) {

  const { user } = useSession()
  const [isPending, startTransition] = useTransition()

  
  const { theme, setTheme } = useTheme()
  const queryClient = useQueryClient()
  
  const handleLogout = async () => {
    startTransition(async () => {
      queryClient.clear()
      await logout()
    })
  }
  return (
    <>
      <LoadingGlobal isPending={isPending} />
      <DropdownMenu>
        <DropdownMenuTrigger className=" rounded-full border-none outline-none">
          <UserAvatar avatarUrl={user?.avatarUrl} size={40} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            Logged in as @{user?.username}
          </DropdownMenuLabel>
          <Link href={`/users/${user?.username}`} className=" cursor-pointer">
            <DropdownMenuItem className=" flex items-center gap-2">
              <Image src={userImage} height={18} className=" invert dark:invert-0" alt="" />
              Profile
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Image src={themeImage} height={18} className=" invert dark:invert-0" alt="" />
              Theme
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <Image src={sunImage} height={18} className=" invert dark:invert-0" alt="" />
                  Light
                  {theme === 'light' && <p className=" font-semibold text-xs text-primary">Selected</p>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <Image src={nightImage} height={18} className=" invert dark:invert-0" alt="" />
                  Dark
                  {theme === 'dark' && <p className=" font-semibold text-xs text-primary">Selected</p>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  <Image src={themeImage} height={18} className=" invert dark:invert-0" alt="" />
                  System
                  {theme === 'system' && <p className=" font-semibold text-xs text-primary">Selected</p>}
                </DropdownMenuItem>

              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem onClick={handleLogout} className=" flex items-center gap-2">
            <Image src={logoutImage} height={18} className=" invert dark:invert-0" alt="" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
