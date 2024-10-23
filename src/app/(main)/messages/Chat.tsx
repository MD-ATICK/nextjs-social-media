
"use client"
import loadingImage from '@/assets/loading.png'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useState } from 'react'
import { Chat as StreamChat } from 'stream-chat-react'
import ChatChannel from './ChatChannel'
import ChatSideBar from './ChatSideBar'
import useInitializeChatClient from './useInitializeChatClient'

export default function Chat() {
    const chatClient = useInitializeChatClient()

    const {resolvedTheme} = useTheme()
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (!chatClient) {
        return <div className=' h-10 w-full flex justify-center items-center'>
            <Image src={loadingImage} height={20} className=" animate-spin" alt="" />
        </div>
    }

    return (
        <main className=' relative w-full overflow-hidden md:rounded-2xl min-h-full md:h-[86vh] md:shadow-sm'>
            <div className=' absolute top-0 bottom-0 flex w-full'>
                <StreamChat client={chatClient} theme={resolvedTheme === "dark" ? "str-chat__theme-dark" : "str-chat__theme-light"} >
                    <ChatSideBar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                    <ChatChannel open={!sidebarOpen} openSidebar={() => setSidebarOpen(true)} />
                </StreamChat>
            </div>
        </main>
    )
}
