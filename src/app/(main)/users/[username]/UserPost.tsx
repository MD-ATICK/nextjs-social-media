"use client"
import InfiniteScrollContainer from '@/components/InfiniteScrollContainer'
import Post from '@/components/posts/Post'
import PostsLoadingSkeleton from '@/components/posts/PostsLoadingSkeleton'
import kyInstance from '@/lib/ky'
import { PostsPage } from '@/lib/types'
import { useInfiniteQuery } from '@tanstack/react-query'

interface props {
    userId: string
}

export default function UserPosts({ userId }: props) {

    const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery({
        queryKey: ['post-feed', 'user-posts', userId],
        queryFn: ({ pageParam }) => kyInstance.get(`/api/users/${userId}/posts`,
            pageParam ? { searchParams: { cursor: pageParam } } : {}
        ).json<PostsPage>(),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })

    const posts = data?.pages.flatMap(page => page.posts) || []

    if (status === 'pending') {
        return <PostsLoadingSkeleton />
    }

    if (status === 'success' && !posts.length && !hasNextPage) {
        return (<p className=' text-center py-3 font-medium text-sm text-muted-foreground'>
            This user does not post anything!
        </p>)
    }
    if (status === 'error') {
        return (<p className=' py-3 text-center font-medium text-sm  text-destructive'>
            An Error occurred while loading posts
        </p>)
    }

    return (
        <InfiniteScrollContainer onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()} className=' py-3  space-y-4'>
            {posts.map(post => (
                <Post key={post.id} post={post} />
            ))}
            {isFetchingNextPage && <PostsLoadingSkeleton />}
        </InfiniteScrollContainer>
    )
}
