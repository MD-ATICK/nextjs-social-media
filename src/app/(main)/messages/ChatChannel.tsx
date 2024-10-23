
import menu from '@/assets/menu-black.png';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Channel, ChannelHeader, ChannelHeaderProps, MessageInput, MessageList, Window } from 'stream-chat-react';

interface ChatChannelProps {
    open: boolean;
    openSidebar: () => void;
}

export default function ChatChannel({ open, openSidebar }: ChatChannelProps) {
    return (
        <div className={cn('w-full md:block', !open && 'hidden')}>
            <Channel>
                <Window>
                    <CustomChannelHeader openSidebar={openSidebar} />
                    <MessageList />
                    <MessageInput />
                </Window>
            </Channel>
        </div>
    )
}


interface CustomChannelHeaderProps extends ChannelHeaderProps {
    openSidebar: () => void;
}



function CustomChannelHeader({ openSidebar, ...props }: CustomChannelHeaderProps) {
    return (
        <div className=' flex items-center gap-3'>
            <div className=' h-full p-2 md:hidden'>
                <Button size={'icon'} variant={'ghost'} onClick={openSidebar}>
                    <Image alt='' src={menu} height={20} />
                </Button>
            </div>
            <ChannelHeader {...props} />
        </div>
    )
}