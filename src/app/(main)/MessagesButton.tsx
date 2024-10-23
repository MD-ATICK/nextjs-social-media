"use client"
import messages from '@/assets/messages.png'
import { Button } from "@/components/ui/button"
import kyInstance from '@/lib/ky'
import { MessageUnreadCountType } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import Image from "next/image"
import Link from "next/link"

interface props {
    initialState: MessageUnreadCountType
}

export default function MessagesButton({ initialState }: props) {

    const { data } = useQuery({
        queryKey: ['unread-messages-count'],
        queryFn: () => kyInstance.get('/api/messages/unread-count').json<MessageUnreadCountType>(),
        initialData: initialState,
        refetchInterval: 60 * 1000, // Fetch data every minute
    })

    return (
        <Button variant={'ghost'} title='Notifications' asChild className=" flex items-center justify-start gap-3">
            <Link href={'/messages'}>
                <div className=' relative'>
                    <Image src={messages} height={22} className=' invert dark:invert-0' alt="" />
                    <span className=' absolute -top-3 -right-3 flex justify-center items-center h-4 aspect-square rounded-full bg-primary text-white font-semibold text-xs'>{data.unreadCount}</span>
                </div>
                <span className=" hidden lg:inline">Messages</span>
            </Link>
            
        </Button>
    )
}
