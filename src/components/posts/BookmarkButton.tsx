import fillBookmark from '@/assets/fill-bookmark.png';
import bookmark from '@/assets/post-bookmark.png';
import { useToast } from "@/hooks/use-toast";
import kyInstance from "@/lib/ky";
import { BookmarkInfo } from "@/lib/types";
import { cn } from '@/lib/utils';
import { QueryKey, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

interface props {
    postId: string,
    initialState: BookmarkInfo
}


export default function BookmarkButton({ postId, initialState }: props) {
    const { toast } = useToast()

    const queryClient = useQueryClient()
    const queryKey: QueryKey = ['bookmark-info', postId]

    const { data } = useQuery({
        queryKey,
        queryFn: () => kyInstance.get(`/api/posts/${postId}/bookmark`).json<BookmarkInfo>(),
        initialData: initialState,
        staleTime: Infinity
    })

    const { mutate } = useMutation({
        mutationFn: () => data.isBookmarkByUser ?
            kyInstance.delete(`/api/posts/${postId}/bookmark`) :
            kyInstance.post(`/api/posts/${postId}/bookmark`),
        onMutate: async () => {

            toast({
                style: { backgroundColor: data.isBookmarkByUser ? 'red' : 'green', color: 'white' },
                description: `Post ${data.isBookmarkByUser ? "un" : ""}bookmarked`,
            });


            await queryClient.cancelQueries({ queryKey })

            const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey);

            queryClient.setQueryData<BookmarkInfo>(queryKey, () => ({
                isBookmarkByUser: !previousState?.isBookmarkByUser
            }))


            return { previousState }
        },
        onError(error, variables, context) {
            queryClient.setQueryData(queryKey, context?.previousState)
            console.log(error);
            toast({
                variant: 'destructive',
                description: 'Failed to bookmark/unbookmark user. Please try again.' + error.message
            })
        }
    })


    return (
        <button onClick={() => mutate()} className=" flex relative h-10 aspect-square items-center gap-2">
            <Image src={bookmark} height={20} className={cn(data.isBookmarkByUser ? 'scale-0' : 'scale-100', 'duration-100 absolute dark:invert')} alt="" />
            <Image src={fillBookmark} height={20} className={cn(data.isBookmarkByUser ? 'scale-100' : 'scale-0', ' duration-100 absolute ')} alt="" />
        </button>
    )
}

