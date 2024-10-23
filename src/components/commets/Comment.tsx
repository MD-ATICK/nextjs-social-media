import { useSession } from "@/app/(main)/SessionProvider";
import { CommentData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import Link from "next/link";
import UserAvatar from "../userAvatar";
import UserTooltip from "../UserTooltip";
import CommentMoreButton from "./CommentInfoButton";

interface props {
    comment: CommentData
}


export default function Comment({ comment }: props) {

    const { user} = useSession()

    return (
        <div className=" flex gap-3 py-3 group/comment">
            <span className=" hidden sm:inline">
                <UserTooltip isPending user={comment.user}>
                    <Link href={`/users/${comment.user.username}`}>
                        <UserAvatar avatarUrl={comment.user.avatarUrl} size={40} />
                    </Link>
                </UserTooltip>
            </span>
            <div>
                <div className=" flex items-center gap-1 text-sm">
                    <UserTooltip isPending user={comment.user}>
                        <Link href={`/users/${comment.user.username}`} className=" font-medium hover:underline">
                            {comment.user.displayName}
                        </Link>
                    </UserTooltip>
                    <span className=" text-muted-foreground text-xs font-medium">
                        ({formatRelativeDate(comment.createdAt)})
                    </span>
                </div>
                <div className=" text-sm font-medium">
                    {comment.content}
                </div>
            </div>
            {
                comment.user.id === user?.id && (
                   <CommentMoreButton comment={comment} className=" ms-auto opacity-0 transition-opacity group-hover/comment:opacity-100" />
                   
                )
            }
        </div>
    )
}
