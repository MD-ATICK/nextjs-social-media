import loadingImage from '@/assets/loading.png'
import { validateRequest } from "@/auth"
import FollowButton from '@/components/FollowButton'
import Linkify from '@/components/Linkify'
import Post from "@/components/posts/Post"
import UserAvatar from "@/components/userAvatar"
import UserTooltip from "@/components/UserTooltip"
import prisma from "@/lib/prisma"
import { getPostDataInclude, UserData } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cache, Suspense } from "react"


interface props {
    params: { postId: string }
}

const getPost = cache(async (postId: string, loggedInUserId: string) => {
    const post = await prisma.post.findUnique({
        where: { id: postId },
        include: getPostDataInclude(loggedInUserId)
    })

    if (!post) notFound()
    return post;
})

export const generateMetadata = async ({ params: { postId } }: props) => {

    const { user } = await validateRequest()

    if (!user) return {}

    const post = await getPost(postId, user.id)
    return {
        title: `${post.author.displayName} : ${post.content.slice(0, 50)}...`
    }
}



export default async function page({ params: { postId } }: props) {

    const { user } = await validateRequest()

    if (!user) {
        return (
            <div className=" w-full text-sm font-medium">
                Please log in to view this post.
            </div>
        )
    }

    const post = await getPost(postId, user.id)

    return (
        <main className="flex w-full gap-5">
            <div className=" w-full min-w-0 space-y-5">
                <Post post={post} />
            </div>
            <div className=" sticky top-[80px] hidden lg:block h-fit w-80 flex-none">
                <Suspense fallback={<Image src={loadingImage} height={20} className=" animate-spin" alt="" />
                }>
                    <UserInfoSidebar user={post.author} />
                </Suspense>
            </div>
        </main>
    )
}


interface UserInfoSidebarProps {
    user: UserData
}

const UserInfoSidebar = async ({ user }: UserInfoSidebarProps) => {
    const { user: loggedInUser } = await validateRequest()

    if (!loggedInUser) {
        return (
            <div className=" text-sm font-medium">
                Please log in to view this post.
            </div>
        )
    }

    return (
        <div className=" space-y-5 rounded-2xl bg-primary-foreground p-5 shadow-sm">
            <div className=" text-xl font-bold">
                About This User
            </div>
            <UserTooltip user={user} isPending={false}>
                <Link href={`/users/${user.username}`} className=" flex items-center gap-3" >
                    <UserAvatar avatarUrl={user.avatarUrl} className=" flex-none" />
                    <div className=' text-start'>
                        <p className=' line-clamp-1 break-all font-semibold hover:underline'>{user.displayName}</p>
                        <p className=' line-clamp-1 break-all text-muted-foreground font-medium text-sm'>@{user.username}</p>
                    </div>
                </Link>
            </UserTooltip>
            <Linkify>
                <div className=' line-clamp-6 text-sm pt-2 border-t whitespace-pre-line break-words text-muted-foreground'>
                    {user.bio}
                </div>
            </Linkify>
            {user.id !== loggedInUser.id && (
                <FollowButton
                    userId={user.id}
                    initialState={{
                        followers: user._count.followers,
                        isFollowedByUser: user.followers.some(({ followerId }) => followerId === loggedInUser.id)
                    }}
                />
            )}
        </div>
    )

}
