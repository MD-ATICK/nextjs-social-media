import { useToast } from "@/hooks/use-toast";
import { PostsPage } from "@/lib/types";
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { deletePost } from "./actions";


export function useDeletePostMutation() {
    const { toast } = useToast()

    const queryClient = useQueryClient()
    const router = useRouter()
    const pathname = usePathname()

    const mutation = useMutation({
        mutationFn: deletePost,
        onSuccess: async (deletedPost) => {
            const queryFilter: QueryFilters = { queryKey: [ 'post-feed','for-you'] }
            await queryClient.cancelQueries(queryFilter)

             queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
                queryFilter,
                (oldData) => {
                    if (!oldData) return;

                    return {
                        pageParams: oldData.pageParams,
                        pages: oldData.pages.map(page => {
                            return {
                                nextCursor: page.nextCursor,
                                posts: page.posts.filter(post => post.id !== deletedPost.id)
                            }
                        })
                    }
                }
            )

            toast({
                description: 'Post Deleted'
            })

            if (pathname === `/posts/${deletedPost.id}`) {
                router.push(`/users/${deletedPost.author.username}`)
            }
        },
        onError(error) {
            console.log(error)
            toast({
                variant: 'destructive',
                description: 'Failed to delete post. Please try again.',
                style : {backgroundColor : 'green', color : 'white'}
            })
        }
    })

    return mutation
}