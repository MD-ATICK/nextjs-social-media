"use client"
import bell from '@/assets/bell.png'
import { Button } from "@/components/ui/button"
import kyInstance from '@/lib/ky'
import { NotificationUnreadCountProps } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import Image from "next/image"
import Link from "next/link"

interface props {
    initialState: NotificationUnreadCountProps
}

export default function NotificationButton({ initialState }: props) {

    const { data } = useQuery({
        queryKey: ['unread-notification-count'],
        queryFn: () => kyInstance.get('/api/notifications/unread-count').json<NotificationUnreadCountProps>(),
        initialData: initialState,
        refetchInterval: 60 * 1000, // Fetch data every minute
    })

    return (
        <Button variant={'ghost'} title='Notifications' asChild className=" flex items-center justify-start gap-3">
            <Link href={'/notifications'}>
                <div className=' relative'>
                    <Image src={bell} height={22} className=' invert dark:invert-0' alt="" />
                    <span className=' absolute -top-3 -right-3 flex justify-center items-center h-4 aspect-square rounded-full bg-primary text-white font-semibold text-xs'>{data.unreadCount}</span>
                </div>
                <span className=" hidden lg:inline">Notifications</span>
            </Link>
        </Button>
    )
}
