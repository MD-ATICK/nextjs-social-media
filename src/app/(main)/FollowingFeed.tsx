"use client"
import InfiniteScrollContainer from '@/components/InfiniteScrollContainer'
import Post from '@/components/posts/Post'
import PostsLoadingSkeleton from '@/components/posts/PostsLoadingSkeleton'
import kyInstance from '@/lib/ky'
import { PostsPage } from '@/lib/types'
import { useInfiniteQuery } from '@tanstack/react-query'

export default function FollowingFeed() {

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ['post-feed','following'],
    queryFn: ({ pageParam }) => kyInstance.get('/api/posts/following',
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
      No posts found. Follow people to get post!
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
