import closeImage from '@/assets/close.png';
import searchImage from '@/assets/search.png';
import LoadingButton from '@/components/loadingButton';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import UserAvatar from '@/components/userAvatar';
import { useToast } from "@/hooks/use-toast";
import useDebounce from "@/hooks/useDebounce";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { UserResponse } from "stream-chat";
import { DefaultStreamChatGenerics, useChatContext } from "stream-chat-react";
import { useSession } from "../SessionProvider";
import Loading from '../loading';


interface props {
    onOpenChange: (open: boolean) => void;
    onChatCreated: () => void;
}
export default function NewChatDialog({ onChatCreated, onOpenChange }: props) {

    const { toast } = useToast()
    const { client, setActiveChannel } = useChatContext()
    const { user: loggedInUser } = useSession()

    const [searchInput, setSearchInput] = useState("");
    const searchInputDebounced = useDebounce(searchInput)

    const [selectedUsers, setSelectedUsers] = useState<UserResponse<DefaultStreamChatGenerics>[]>([]);

    if (!loggedInUser) throw new Error("You must be logged in")

    const { data, isSuccess, isFetching, error, isError } = useQuery({
        queryKey: ['stream-users', searchInputDebounced],
        queryFn: async () => (
            client.queryUsers({
                id: { $ne: loggedInUser?.id },
                role: { $ne: "admin" },
                ...(searchInputDebounced ?
                    {
                        $or: [
                            { name: { $autocomplete: searchInputDebounced } },
                            { username: { $autocomplete: searchInputDebounced } },
                        ]
                    } : {}
                )
            })
        )
    })

    const onClick = (user: UserResponse<DefaultStreamChatGenerics>) => {
        setSelectedUsers((prev) => prev.some(u => u.id === user.id) ? prev.filter(u => u.id !== user.id) : [...prev, user])
    }

    const mutation = useMutation({
        mutationFn: async () => {
            const channel = client.channel('messaging', {
                members: [loggedInUser.id, ...selectedUsers.map(u => u.id)],
                name: selectedUsers.length > 1 ? (loggedInUser.displayName + ", " + selectedUsers.map(u => u.name).join(', ')) : undefined
            })

            await channel.create()
            return channel;
        },
        onSuccess: (channel) => {
            setActiveChannel(channel)
            onChatCreated()
        },
        onError(err) {
            console.log("Error staring chat", err)
            toast({
                variant: 'destructive',
                description: 'Failed to start a new chat. Please try again.'
            })
        }
    })

    return (
        <Dialog open onOpenChange={onOpenChange}>
            <DialogContent className=" bg-primary-foreground">
                <DialogHeader className=" px-6 pt-6">
                    <DialogTitle>New Chat</DialogTitle>
                </DialogHeader>
                <div className=' py-2'>
                    <div className=" relative w-full rounded-full border bg-gray-200 dark:bg-primary-foreground">
                        <Input onChange={(e) => setSearchInput(e.target.value)} placeholder="Search" name="query" className=" w-full rounded-full pr-10" />
                        <Image src={searchImage} height={15} className=' invert dark:invert-0 absolute right-4 top-1/2 -translate-y-1/2' alt="" />
                    </div>
                    {

                        !!selectedUsers.length && (
                            <div className=' mt-4 flex flex-wrap gap-2 p-2'>
                                {selectedUsers.map(user => (
                                    <SelectedUserTag key={user.id} user={user} onRemove={() => onClick(user)} />
                                ))}
                            </div>
                        )
                    }
                    <div className=' h-96 overflow-y-auto py-2'>
                        {isSuccess && !data.users.length && (
                            <p className=' text-center text-sm font-medium text-muted-foreground'>No Users found. Try a different name!</p>
                        )}
                        {isFetching && <Loading />}
                        {isError && (
                            <p className=' text-center text-sm font-medium text-destructive'>{error.message}</p>
                        )}
                        {isSuccess && (
                            data.users.map(user => (
                                <UserResult
                                    key={user.id}
                                    user={user}
                                    selected={selectedUsers.some(u => u.id === user.id)}
                                    onClick={() => onClick(user)}
                                />
                            ))
                        )}

                    </div>
                </div>
                <DialogFooter>
                    <LoadingButton
                     disabled={!selectedUsers.length}
                     isPending={mutation.isPending}
                     onClick={() => mutation.mutate()}
                     >
                        Start Chat
                     </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


interface UserResultProps {
    user: UserResponse<DefaultStreamChatGenerics>,
    selected: boolean,
    onClick: () => void
}

function UserResult({ user, selected, onClick }: UserResultProps) {

    return (
        <button onClick={onClick} className=' font-medium text-sm flex w-full items-center justify-between px-2 py-2 transition-colors hover:bg-muted/50'>
            <div className=' flex items-center gap-2'>
                <UserAvatar avatarUrl={user.image} />
                <div className='flex flex-col items-start'>
                    <p>{user.name}</p>
                    <p className=' text-muted-foreground'>@{user.username}</p>
                </div>
            </div>
            {selected && <p className=' text-primary text-xs font-medium'>Selected</p>}
        </button>
    )
}


interface SelectedUserTagProps {
    user: UserResponse<DefaultStreamChatGenerics>,
    onRemove: () => void
}

function SelectedUserTag({ user, onRemove }: SelectedUserTagProps) {
    return <button onClick={onRemove} className=' flex items-center gap-2 rounded-full border p-1 pr-2 hover:bg-muted/50'>
        <UserAvatar avatarUrl={user.image} />
        <p className=' font-bold text-sm'>{user.name}</p>
        <Image src={closeImage} height={15} alt='' className=' dark:invert' />
    </button>
}