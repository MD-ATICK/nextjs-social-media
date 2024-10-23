import comment from '@/assets/comment.png';
import follow from '@/assets/follow.png';
import like from '@/assets/heart.png';
import UserAvatar from '@/components/userAvatar';
import { notificationData } from "@/lib/types";
import { cn } from '@/lib/utils';
import { NotificationType } from "@prisma/client";
import Image from "next/image";
import Link from 'next/link';

interface props {
    notification: notificationData
}


export default function Notification({ notification }: props) {

    const notificationTypeMap: Record<NotificationType, { message: string, icon: JSX.Element, href: string }> = {
        FOLLOW: {
            message: `${notification.issuer.displayName} followed you`,
            icon: <Image src={follow} height={20} alt="" className=' dark:invert' />,
            href: `/users/${notification.issuer.username}`
        },
        LIKE: {
            message: `${notification.issuer.displayName} liked your post`,
            icon: <Image src={like} height={20} alt="" className=' dark:invert' />,
            href: `/posts/${notification.postId}`
        },
        COMMENT: {
            message: `${notification.issuer.displayName} commented on your  post`,
            icon: <Image src={comment} height={20} alt="" className=' dark:invert' />,
            href: `/posts/${notification.postId}`
        },
    }

    const { message, icon, href } = notificationTypeMap[notification.type]

    return (
        <Link href={href} className=' block'>
            <article className={cn(' flex gap-3 rounded-2xl bg-primary-foreground p-5 shadow-sm transition-colors hover:bg-primary-foreground/70', !notification.read && 'bg-primary/10')}>
                <div>{icon}</div>
                <div className=' space-y-3'>
                    <UserAvatar avatarUrl={notification.issuer.avatarUrl} size={36} />
                    <div>
                        <span className=' font-bold'>{notification.issuer.displayName}</span> {" "}
                        <span className=' text-sm font-medium'>{message}</span>
                    </div>
                    {
                        notification.post && (
                            <div className=' line-clamp-3 text-muted-foreground whitespace-pre-line'>
                                {notification.post.content}
                            </div>
                        )
                    }
                </div>
            </article>
        </Link>
    )
}
