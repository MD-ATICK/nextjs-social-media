import { useToast } from "@/hooks/use-toast"
import { PostsPage } from "@/lib/types"
import { useUploadThing } from "@/lib/uploadthing"
import { UpdateUserProfileValues } from "@/lib/validation"
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { updateUserProfile } from "./actions"

interface mutationProps {
    values: UpdateUserProfileValues,
    avatar?: File
}

export function useUpdateUserProfileMutation() {

    const { toast } = useToast()

    const router = useRouter()

    const queryClient = useQueryClient()

    const { startUpload: startAvatarUpload } = useUploadThing('avatar')

    const mutation = useMutation({
        mutationFn: async ({ values, avatar }: mutationProps) => {
            return Promise.all([
                updateUserProfile(values),
                avatar && startAvatarUpload([avatar])
            ])
        },
        onSuccess: async ([data, uploadResult]) => {
            const newAvatarUrl = uploadResult?.[0].serverData.avatarUrl;

            const queryFilter: QueryFilters = { queryKey: ['post-feed'] }
            await queryClient.cancelQueries(queryFilter)


            queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
                queryFilter,
                (oldData) => {

                    if (!oldData) return;

                    return {
                        pageParams: oldData.pageParams,
                        pages: oldData.pages.map((page) => {
                            return {
                                nextCursor: page.nextCursor,
                                posts: page.posts.map(post => {
                                    if (post.author.id === data.updatedUser?.id) {
                                        return {
                                            ...post,
                                            author: {
                                                ...data.updatedUser,
                                                avatarUrl: newAvatarUrl || data.updatedUser.avatarUrl
                                            }
                                        }
                                    }

                                    return post;
                                })
                            }
                        })
                    }

                    // end;
                }
            )

            router.refresh()
            toast({
                description: "Profile Updated.",
                style: {backgroundColor : 'green', color : 'white'}
            })

        },
        onError(error) {
            console.log(error)
            toast({
                variant: 'destructive',
                description: 'Failed to update profile. Please try again.'
            })
        }
        // mutation end;
    })


    return mutation;
}