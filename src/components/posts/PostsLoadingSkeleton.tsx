import { Skeleton } from "../ui/skeleton"

export default function PostsLoadingSkeleton() {
    return (
        <div className=" space-y-5">
            <PostLoadingSkeleton />
            <PostLoadingSkeleton />
            <PostLoadingSkeleton />
        </div>
    )
}



function PostLoadingSkeleton() {
    return <div className=' w-full animate-pulse space-y-3 p-5 rounded-2xl bg-primary-foreground'>
        <div className="flex flex-wrap  gap-3">
            <Skeleton className=" size-12 rounded-full" />
            <div className=" space-y-2">
                <Skeleton className=" h-4 rounded w-24" />
                <Skeleton className=" h-4 rounded w-20" />
            </div>
        </div>
        <Skeleton className=" h-28 rounded-xl" />

    </div>
}