
import bookmark from '@/assets/bookmark.png'
import home from '@/assets/home.png'
import { validateRequest } from '@/auth'
import { Button } from "@/components/ui/button"
import prisma from '@/lib/prisma'
import streamServerClient from '@/lib/stream'
import Image from "next/image"
import Link from "next/link"
import MessagesButton from './MessagesButton'
import NotificationButton from './NotificationButton'

interface props {
    className?: string
}
export default async function MenuBar({ className }: props) {

    const { user } = await validateRequest()
    if (!user) return null;


    const [unreadNotifications, unreadMessagesCount] = await Promise.all([
        prisma.notification.count({
            where: {
                recipientId: user.id,
                read: false
            }
        }),
        ((await streamServerClient.getUnreadCount(user.id)).total_unread_count)
    ])


    return (
        <div className={`${className}`}>
            <Button variant={'ghost'} title='Home' asChild className=" flex items-center justify-start gap-3">
                <Link href={'/'}>
                    <Image src={home} height={22} className=' invert dark:invert-0' alt="" />
                    <span className=" hidden lg:inline">Home</span>
                </Link>
            </Button>
            <NotificationButton initialState={{ unreadCount: unreadNotifications }} />
            <MessagesButton initialState={{ unreadCount: unreadMessagesCount }} />
            <Button variant={'ghost'} title='BookMarks' asChild className=" flex items-center justify-start gap-3">
                <Link href={'/bookmarks'}>
                    <Image src={bookmark} height={22} className=' invert dark:invert-0' alt="" />
                    <span className=" hidden lg:inline">BookMarks</span>
                </Link>
            </Button>
        </div>
    )
}
