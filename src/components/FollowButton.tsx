"use client"
import { useToast } from '@/hooks/use-toast'
import useFollowerInfo from '@/hooks/userFollowerInfo'
import kyInstance from '@/lib/ky'
import { FollowerInfo } from '@/lib/types'
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from './ui/button'

interface props {
  userId: string,
  initialState: FollowerInfo
}
export default function FollowButton({ userId, initialState }: props) {

  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { data } = useFollowerInfo(userId, initialState)
  const queryKey: QueryKey = ['follower-info', userId]

  const { mutate } = useMutation({
    mutationFn: () => data.isFollowedByUser ?
      kyInstance.delete(`/api/users/${userId}/followers`) :
      kyInstance.post(`/api/users/${userId}/followers`),
    onMutate: async () => {

      await queryClient.cancelQueries({ queryKey })

      const previousState = queryClient.getQueryData<FollowerInfo>(queryKey);

      queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
        followers: (previousState?.followers || 0) +
          (previousState?.isFollowedByUser ? -1 : 1),
        isFollowedByUser: !previousState?.isFollowedByUser
      }))

      return { previousState }
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState)
      console.log(error);
      toast({
        variant: 'destructive',
        description: 'Failed to follow/unfollow user. Please try again.'
      })
    }
  })


  return (
    <Button
      variant={data.isFollowedByUser ? "destructive" : "default"}
      onClick={() => mutate()}
    >
      {data.isFollowedByUser ? 'UnFollow' : 'Follow'}
    </Button>
  )
}
