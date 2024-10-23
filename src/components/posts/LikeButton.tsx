import redHeart from '@/assets/fill-heart.png';
import heart from '@/assets/heart.png';
import { useToast } from "@/hooks/use-toast";
import kyInstance from "@/lib/ky";
import { LikeInfo } from "@/lib/types";
import { cn } from '@/lib/utils';
import { QueryKey, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

interface props {
    postId: string,
    initialState: LikeInfo
}


export default function LikeButton({ postId, initialState }: props) {
    const { toast } = useToast()

    const queryClient = useQueryClient()
    const queryKey: QueryKey = ['like-info', postId]

    const { data } = useQuery({
        queryKey,
        queryFn: () => kyInstance.get(`/api/posts/${postId}/likes`).json<LikeInfo>(),
        initialData: initialState,
        staleTime: Infinity
    })

    const { mutate } = useMutation({
        mutationFn: () => data.isLikedByUser ?
            kyInstance.delete(`/api/posts/${postId}/likes`) :
            kyInstance.post(`/api/posts/${postId}/likes`),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey })

            const previousState = queryClient.getQueryData<LikeInfo>(queryKey);

            queryClient.setQueryData<LikeInfo>(queryKey, () => ({
                likes: (previousState?.likes || 0) +
                    (previousState?.isLikedByUser ? -1 : 1),
                isLikedByUser: !previousState?.isLikedByUser
            }))

            return { previousState }
        },
        onError(error, variables, context) {
            queryClient.setQueryData(queryKey, context?.previousState)
            console.log(error);
            toast({
                variant: 'destructive',
                description: 'Failed to like/unlike user. Please try again.' + error.message
            })
        }
    })


    return (
        <button onClick={() => mutate()} className=" flex items-center gap-2">
            <Image src={heart} height={20} className={cn(data.isLikedByUser ? 'scale-0' : ' scale-100', 'duration-100 dark:invert absolute')} alt="" />
            <Image src={redHeart} height={20} className={cn(data.isLikedByUser ? 'scale-100' : 'scale-0', ' duration-100 dark:invert absolute')} alt="" />
            <span className=" tabular-nums font-medium pl-7 text-sm">
                {data.likes} <span className=" hidden sm:inline">likes</span>
            </span>
        </button>
    )
}

