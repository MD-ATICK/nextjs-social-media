"use client"
import InfiniteScrollContainer from '@/components/InfiniteScrollContainer'
import PostsLoadingSkeleton from '@/components/posts/PostsLoadingSkeleton'
import kyInstance from '@/lib/ky'
import { NotificationPage } from '@/lib/types'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import Notification from './Notification'

export default function Notifications() {

    const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery({
        queryKey: ['notifications'],
        queryFn: ({ pageParam }) => kyInstance.get('/api/notifications',
            pageParam ? { searchParams: { cursor: pageParam } } : {}
        ).json<NotificationPage>(),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })

    const queryClient = useQueryClient()

    const notifications = data?.pages.flatMap(page => page.notifications) || []

    const { mutate } = useMutation({
        mutationFn: () => kyInstance.patch(`/api/notifications/mark-as-read`),
        onSuccess: () => {
            queryClient.setQueryData(['unread-notification-count'], { unreadCount: 0 })
        },
        onError(error) {
            console.log(error)
            console.log(`Failed to mark as read notification`)
        }
    })

    useEffect(() => {
        mutate()
    }, [mutate]);

    if (status === 'pending') {
        return <PostsLoadingSkeleton />
    }

    if (status === 'success' && !notifications.length && !hasNextPage) {
        return (<p className=' text-center font-medium text-sm text-muted-foreground'>
            You don&apos;t have any notifications.
        </p>)
    }
    if (status === 'error') {
        return (<p className=' text-center font-medium text-sm  text-destructive'>
            An Error occurred while loading posts
        </p>)
    }

    return (
        <InfiniteScrollContainer onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()} className='  space-y-3 py-3'>
            {notifications.map(notification => (
                <Notification key={notification.id} notification={notification} />
            ))}
            {isFetchingNextPage && <PostsLoadingSkeleton />}
        </InfiniteScrollContainer>
    )
}
