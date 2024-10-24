import { useToast } from "@/hooks/use-toast";
import { CommentPage } from "@/lib/types";
import { InfiniteData, QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment, submitComment } from "./actions";


export function useSubmitCommentMutation(postId: string) {
    const { toast } = useToast()

    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: submitComment,
        onSuccess: async (newComment) => {
            const queryKey: QueryKey = ['comments', postId]
            await queryClient.cancelQueries({ queryKey })

            queryClient.setQueryData<InfiniteData<CommentPage, string | null>>(
                queryKey,
                (oldData) => {
                    const firstPage = oldData?.pages[0]

                    if (firstPage) {
                        return {
                            pageParams: oldData.pageParams,
                            pages: [
                                {
                                    previousCursor: firstPage.previousCursor,
                                    comments: [...firstPage.comments, newComment]
                                }
                            ]
                        }
                    }
                }
            )

            queryClient.invalidateQueries({
                queryKey,
                predicate(query) {
                    return !query.state.data
                }
            })

            toast({
                description: 'Comment Created'
            })
        },
        onError(error) {
            console.log(error)
            toast({
                variant: 'destructive',
                description: 'Failed to create comment. Please try again.' + error.message
            })
        }
    })

    return mutation;
}


export function useDeleteCommentMutation() {
    const { toast } = useToast()

    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: deleteComment,
        onSuccess: async (deletedComment) => {
            const queryKey: QueryKey = ['comments', deletedComment.post.id]
            await queryClient.cancelQueries({ queryKey })

            queryClient.setQueryData<InfiniteData<CommentPage, string | null>>(
                queryKey,
                (oldData) => {

                    if (!oldData) return;

                    return {
                        pageParams: oldData.pageParams,
                        pages: oldData.pages.map(page => ({
                            previousCursor: page.previousCursor,
                            comments: page.comments.filter(c => c.id !== deletedComment.id)
                        }))
                    }

                }
            )

            toast({
                description: 'Comment deleted'
            })

        },
        onError(error) {
            console.log(error)
            toast({
                variant: 'destructive',
                description: 'Failed to delete comment. Please try again.' + error.message
            })
        },
    })

    return mutation;
}