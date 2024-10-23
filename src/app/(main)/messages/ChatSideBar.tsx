
import addGroup from '@/assets/add-group.png';
import close from '@/assets/close.png';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { ChannelList, ChannelPreviewMessenger, ChannelPreviewUIComponentProps, useChatContext } from 'stream-chat-react';
import { useSession } from '../SessionProvider';
import NewChatDialog from './NewChatDialog';

interface ChatSideBarProps {
    open: boolean,
    onClose: () => void
}

export default function ChatSideBar({ open, onClose }: ChatSideBarProps) {

    const { user } = useSession()

    const queryClient = useQueryClient()
    const { channel } = useChatContext()
    useEffect(() => {
        if (channel?.id) {
            queryClient.invalidateQueries({ queryKey: ['unread-messages-count'] })
        }
    }, [channel, queryClient]);


    const ChannelPreviewCustom = useCallback(
        (props: ChannelPreviewUIComponentProps) => (
            <ChannelPreviewMessenger
                {...props}
                onSelect={() => {
                    if (props.setActiveChannel && props.channel) {
                        props.setActiveChannel(props.channel, props.watchers);
                    }
                    onClose();
                }}
            />
        ),
        [onClose]
    );

    if (!user) return <p className=' p-5 text-sm font-medium'>user not found!</p>;

    return (
        <div className={cn('size-full h-full bg-primary-foreground md:flex flex-col border-e md:w-72', open ? 'flex' : 'hidden')}>
            <MenuHeader onClose={onClose} />
            <ChannelList
                filters={{
                    type: 'messaging',
                    members: { $in: [user?.id] }
                }}
                showChannelSearch
                options={{ state: true, presence: true, limit: 8 }}
                sort={{ last_message_at: -1 }}
                additionalChannelSearchProps={{
                    searchForChannels: true,
                    searchQueryParams: {
                        channelFilters: {
                            filters: { members: { $in: [user.id] } }
                        }
                    }
                }}
                Preview={ChannelPreviewCustom}
            />

        </div>
    )
}


interface MenuHeaderProps {
    onClose: () => void
}

function MenuHeader({ onClose }: MenuHeaderProps) {


    const [showNewChatDialog, setShowNewChatDialog] = useState(false);

    return (
        <div className=' flex items-center gap-3 p-2'>
            <div className=' h-full md:hidden'>
                <Button size={'icon'} onClick={onClose} variant={'ghost'}>
                    <Image alt='' height={20} src={close} />
                </Button>
            </div>
            <h1 className=' font-bold text-xl md:mx-2 me-auto'>Messages</h1>
            <Button onClick={() => setShowNewChatDialog(true)} size={'icon'} className=' ml-auto' variant={'ghost'} title='Start new Chat'>
                <Image alt='' height={30} src={addGroup} className=' dark:invert' />
            </Button>
            {
                showNewChatDialog && (
                    <NewChatDialog onOpenChange={setShowNewChatDialog} onChatCreated={() => {
                        setShowNewChatDialog(false)
                        onClose()
                    }} />
                )
            }
        </div>
    )
}