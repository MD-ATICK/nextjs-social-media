import loadingImage from '@/assets/loading.png'
import kyInstance from "@/lib/ky"
import { CommentPage, PostData } from "@/lib/types"
import { useInfiniteQuery } from "@tanstack/react-query"
import Image from "next/image"
import { Button } from "../ui/button"
import Comment from "./Comment"
import CommentInput from "./CommentInput"


interface props {
  post: PostData
}


export default function Comments({ post }: props) {

  const { data, fetchNextPage, hasNextPage, isFetching, status } = useInfiniteQuery({
    queryKey: ['comments', post.id],
    queryFn: ({ pageParam }) => kyInstance.get(`/api/posts/${post.id}/comments`, pageParam ? { searchParams: { cursor: pageParam } } : {}).json<CommentPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (firstPage) => firstPage.previousCursor,
    select: (data) => ({
      pages: [...data.pages].reverse(),
      pageParams: [...data.pageParams].reverse()
    })
  })

  const comments = data?.pages.flatMap((page) => page.comments) || []

  return (
    <div className=" space-y-3">
      <CommentInput post={post} />
      {hasNextPage && (
        <Button
          variant={'link'}
          className=" mx-auto block"
          disabled={isFetching}
          onClick={() => fetchNextPage()}
        >
          {
            isFetching ?
              <Image src={loadingImage} height={20} className=" animate-spin" alt="" />
              :
              "Load previous comments"
          }

        </Button>
      )}
      {
        status === 'pending' && <Image src={loadingImage} height={20} className=" mx-auto animate-spin" alt="" />
      }
      {
        status === 'success' && !comments.length && (
          <p className=' text-muted-foreground text-sm font-medium'>No comment yet</p>
        )
      }
      {
        status === 'error' && (
          <p className=' text-destructive text-sm font-medium'>Something held wrong!</p>
        )
      }
      <div className=" divide-y">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  )
}