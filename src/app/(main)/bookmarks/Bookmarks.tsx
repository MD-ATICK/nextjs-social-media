"use client"
import InfiniteScrollContainer from '@/components/InfiniteScrollContainer'
import Post from '@/components/posts/Post'
import PostsLoadingSkeleton from '@/components/posts/PostsLoadingSkeleton'
import kyInstance from '@/lib/ky'
import { PostsPage } from '@/lib/types'
import { useInfiniteQuery } from '@tanstack/react-query'

export default function Bookmarks() {

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ['post-feed','borkmarks' ],
    queryFn: ({ pageParam }) => kyInstance.get('/api/posts/bookmarked',
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
    return (<p className=' text-center font-medium text-sm text-muted-foreground'>
      You don&apos;t have any bookmarks.
    </p>)
  }
  if (status === 'error') {
    return (<p className=' text-center font-medium text-sm  text-destructive'>
      An Error occurred while loading posts
    </p>)
  }

  return (
    <InfiniteScrollContainer onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()} className='  space-y-3 py-3'>
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
      {isFetchingNextPage && <PostsLoadingSkeleton />}
    </InfiniteScrollContainer>
  )
}
