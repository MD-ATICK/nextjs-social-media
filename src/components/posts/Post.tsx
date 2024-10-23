"use client"
import { useSession } from "@/app/(main)/SessionProvider"
import commentImage from '@/assets/comment.png'
import { PostData } from "@/lib/types"
import { cn, formatRelativeDate } from "@/lib/utils"
import { Media } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import Comments from "../commets/Comments"
import Linkify from "../Linkify"
import UserAvatar from "../userAvatar"
import UserTooltip from "../UserTooltip"
import BookmarkButton from "./BookmarkButton"
import LikeButton from "./LikeButton"
import PostMoreButton from "./PostMoreButton"

interface props {
    post: PostData
}

export default function Post({ post }: props) {

    const { user } = useSession()

    const [showComments, setShowComments] = useState(false);

    return (
        <article className="group/moreBtn space-y-3 rounded-xl bg-primary-foreground p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-3">
                    <UserTooltip isPending={false} user={post.author}>
                        <Link href={`/users/${post.author.username}`}>
                            <UserAvatar avatarUrl={post.author.avatarUrl} />
                        </Link>
                    </UserTooltip>
                    <div>
                        <Link href={`/users/${post.author.username}`} className=" block text-sm capitalize font-medium hover:underline">
                            {post.author.displayName}
                        </Link>
                        <Link suppressHydrationWarning href={`/posts/${post.id}`} className=" font-medium block text-xs text-muted-foreground hover:underline">
                            {formatRelativeDate(post.createdAt)}
                        </Link>
                    </div>
                </div>
                {
                    post.author.id === user?.id && (
                        <PostMoreButton post={post} className=" opacity-0 transition-opacity group-hover/moreBtn:opacity-100" />
                    )
                }
            </div>
            <div className=" leading-7 text-sm font-medium flex flex-col gap-3 whitespace-pre-line break-words">
                <div>
                    <Linkify>
                        {post.content}
                    </Linkify>
                </div>
                {!!post.attachments.length && (
                    <MediaPreviews attachments={post.attachments} />
                )}
                <hr className=" text-muted-foreground" />
                <div className=" w-full flex items-center justify-between">
                    <div className=" flex items-center gap-5">
                        <LikeButton
                            postId={post.id}
                            initialState={{
                                likes: post._count.likes,
                                isLikedByUser: post.likes.some(like => like.userId === user?.id)
                            }}
                        />
                        <CommentButton post={post} onClick={() => setShowComments(!showComments)} />
                    </div>
                    <BookmarkButton postId={post.id} initialState={{ isBookmarkByUser: post.bookmarks.some(bookmark => bookmark.userId === user?.id) }} />
                </div>
            </div>
            {
                showComments && (
                    <Comments post={post} />
                )
            }
        </article>
    )
}


interface MediaPreviewsProps {
    attachments: Media[]
}

function MediaPreviews({ attachments }: MediaPreviewsProps) {
    return (
        <div className={cn('flex  flex-wrap gap-3 justify-start',)}>
            {
                attachments.map(m => (
                    <MediaPreview key={m.id} media={m} />
                ))
            }
        </div>
    )

}
interface MediaPreviewProps {
    media: Media
}

function MediaPreview({ media }: MediaPreviewProps) {

    if (media.type === "IMAGE") {
        return <Image
            src={media.url}
            alt='Attachment preview'
            width={300}
            height={300}
            sizes="300px"
            className=' size-fit max-w-[48%] xl:max-w-[32%] max-h-[25rem] rounded-2xl'
        />

    }

    if (media.type === "VIDEO") {
        return <video controls src={media.url} className=' size-fit max-h-[30rem] rounded-2xl' />
    }


    return <p className=" text-destructive">Unsupported Media type</p>
}


interface CommentButtonProps {
    post: PostData,
    onClick: () => void
}

function CommentButton({ post, onClick }: CommentButtonProps) {
    return <button className=" flex items-center gap-2" onClick={onClick}>
        <Image src={commentImage} height={20} alt="" className="dark:invert" />
        <span className=" text-sm font-medium tabular-nums">
            {post._count.comments}{" "}
            <span className=" hidden sm:inline">comments</span>
        </span>
    </button>
}