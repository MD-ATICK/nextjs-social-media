"use client"
import { useSession } from '@/app/(main)/SessionProvider'
import loadingImage from '@/assets/loading.png'
import { FollowerInfo, UserData } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'
import { PropsWithChildren } from 'react'
import FollowButton from './FollowButton'
import FollowerCount from './FollowerCount'
import Linkify from './Linkify'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import UserAvatar from './userAvatar'

interface props extends PropsWithChildren {
    user: UserData,
    isPending: boolean
}

export default function UserTooltip({ isPending, user, children }: props) {

    const { user: loggedInUser } = useSession()

    const followerState: FollowerInfo = {
        followers: user._count.followers,
        isFollowedByUser: !!user.followers.some(({ followerId }) => followerId === loggedInUser?.id)
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>{children}</TooltipTrigger>
                <TooltipContent className=' bg-primary-foreground text-card-foreground rounded-2xl shadow-lg'>
                    {isPending && <div className=' h-10 w-full flex justify-center items-center'>
                        <Image src={loadingImage} height={30} className=' animate-spin' alt="" />
                        </div>}
                    <div className=' flex max-w-80 flex-col gap-3 break-words px-1 py-2.5 md:min-w-32'>
                        <div className="flex items-center justify-between gap-2">
                            <Link href={`/users/${user.username}`}>
                                <UserAvatar avatarUrl={user.avatarUrl} size={70} />
                            </Link>
                            {loggedInUser?.id !== user.id && (
                                <FollowButton userId={user.id} initialState={followerState} />
                            )}
                        </div>
                        <div>
                            <Link href={`/users/${user.username}`}>
                                <div className="text-lg font-semibold hover:underline">
                                    {user.displayName}
                                </div>
                                <div className=' text-muted-foreground'>
                                    @{user.username}
                                </div>
                            </Link>
                            <FollowerCount userId={user.id} initialState={followerState} />
                        </div>
                        {user.bio && (
                            <Linkify>
                                <div className=' line-clamp-4 whitespace-pre-line'>
                                    {user.bio}
                                </div>
                            </Linkify>
                        )}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
