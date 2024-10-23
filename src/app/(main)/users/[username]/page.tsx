import avatarPlaceHolder from '@/assets/girl.jpg'
import { validateRequest } from "@/auth"
import FollowButton from "@/components/FollowButton"
import FollowerCount from "@/components/FollowerCount"
import Linkify from '@/components/Linkify'
import TrendsSideBar from "@/components/TrendsSideBar"
import prisma from "@/lib/prisma"
import { FollowerInfo, getUserDataSelect, UserData } from "@/lib/types"
import { formatNumber } from "@/lib/utils"
import { formatDate } from "date-fns"
import { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { cache } from "react"
import EditProfileDialog from "./EditProfileDialog"
import UserPosts from "./UserPost"


interface props {
    params: { username: string }
}

const getUser = cache(async (username: string, loggedInUserId: string) => {
    const user = await prisma.user.findFirst({
        where: {
            username: {
                equals: username,
                mode: 'insensitive'
            }
        },
        select: getUserDataSelect(loggedInUserId)
    })

    if (!user) notFound()

    return user;
})

export async function generateMetadata({ params: { username } }: props): Promise<Metadata> {
    const { user: loggedInUser } = await validateRequest()

    if (!loggedInUser) return {}

    const user = await getUser(username, loggedInUser.id)
    return {
        title: `${user.displayName} (@${user.username})`
    }

}

export default async function SingleUser({ params: { username } }: props) {

    const { user: loggedInUser } = await validateRequest()


    if (!loggedInUser) {
        return (
            <p>Unauthorized!</p>
        )
    }

    const user = await getUser(username, loggedInUser.id)
    return (
        <main className=" flex w-full min-w-0 gap-5">
            <div className=" w-full min-w-0 space-y-5">
                <UserProfile user={user} loggedInUserId={loggedInUser.id} />
                <div className=" h-16 text-muted-foreground text-2xl font-bold rounded-xl bg-primary-foreground flex justify-center items-center w-full my-2">
                    <h1 className=" capitalize">{user.username}&apos;s Posts</h1>
                </div>
                <UserPosts userId={user.id} />
            </div>
            <TrendsSideBar />
        </main>
    )
}



interface userProfileProps {
    user: UserData,
    loggedInUserId: string
}


async function UserProfile({ user, loggedInUserId }: userProfileProps) {

    const followerInfo: FollowerInfo = {
        followers: user._count.followers,
        isFollowedByUser: !!user.followers.some(({ followerId }) => followerId === user.id)
    }

    return (
        <div className=" h-fit w-full space-y-5 rounded-xl bg-primary-foreground flex flex-col justify-center items-center p-5 shadow-sm">
            <div className=" h-52 aspect-square rounded-full overflow-hidden relative">
                <Image
                    src={user.avatarUrl || avatarPlaceHolder}
                    alt='User Avatar'
                    fill
                    sizes="200px"
                    className={'aspect-square h-fit flex-none rounded-full bg-secondary object-cover'}
                />
            </div>
            <div className=" flex flex-wrap w-full items-center pr-6 gap-3 font-medium text-sm sm:flex-nowrap">
                <div className=" me-auto space-y-3">
                    <div>
                        <h1 className=" text-2xl font-bold capitalize">{user.displayName}</h1>
                        <div className=" text-muted-foreground">@{user.displayName}</div>
                    </div>
                    <div>Member since: {formatDate(user.createdAt, 'MMM d, yyyy')}</div>
                    <div className="flex items-center gap-3">
                        <span>
                            Post:{" "}
                            <span className=" font-semibold">
                                {formatNumber(user._count.posts)}
                            </span>
                        </span>
                        <FollowerCount userId={user.id} initialState={followerInfo} />
                    </div>
                    {user.bio && (
                        <>
                            <hr />
                            <div className=" overflow-hidden whitespace-pre-line break-words">
                                <Linkify>
                                    {user.bio}
                                </Linkify>
                            </div>
                        </>
                    )}
                </div>

                {user.id === loggedInUserId ? (
                    <EditProfileDialog user={user} />
                ) : (
                    <FollowButton userId={user.id} initialState={followerInfo} />
                )}

            </div>
        </div>
    )
}

