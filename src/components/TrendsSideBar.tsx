import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";
import FollowButton from "./FollowButton";
import UserAvatar from "./userAvatar";
import UserTooltip from "./UserTooltip";

export default function TrendsSideBar() {
    return (
        <div className=' sticky top-24 hidden md:block lg:w-80 w-72 space-y-5 h-fit flex-none'>
            <Suspense fallback={<p className=" text-gray-300 text-sm font-medium">Loading...</p>}>
                <WhoToFollow />
                <TreadingTopics />
            </Suspense>
        </div>
    )
}


async function WhoToFollow() {

    const { user } = await validateRequest()
    if (!user) return null;

    const usersToFollow = await prisma.user.findMany({
        where: {
            NOT: {
                id: user.id
            },
            followers: {
                none: {
                    followerId: user.id
                }
            }
        },
        select: getUserDataSelect(user.id),
        take: 5
    })


    getTrendingTopics()

    return (
        <div className=" space-y-5 rounded-xl bg-primary-foreground p-5 shadow-sm">
            <div className="text-xl font-bold">Who To follow</div>
            {usersToFollow.length === 0 && <p className=" font-medium text-sm py-1 text-muted-foreground">No one have to follow!</p>}
            {
                usersToFollow.map((user) => (
                    <div key={user.id} className=" flex items-center justify-between gap-3">
                        <Link href={`/users/${user.username}`} className=" flex items-center gap-3">
                            <UserTooltip user={user}>
                                <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
                            </UserTooltip>
                            <div>
                                <p className=" capitalize line-clamp-1 break-all font-semibold hover:underline">{user.displayName}</p>
                                <p className="line-clamp-1 text-sm break-all text-muted-foreground">@{user.username}</p>
                            </div>
                        </Link>
                        <FollowButton
                            userId={user.id}
                            initialState={{
                                followers: user._count.followers,
                                isFollowedByUser: user.followers.some(({ followerId }) => followerId === user.id)
                            }}
                        />
                    </div>
                ))
            }
        </div>
    )

}


type HashtagResult = {
    hash: string;
    count: number;
}


// todo : revise this hard topic : just takes all hash from content like content = "i am atick #admin" then just take this #admin. like form all posts and return {hash : '#admin , count : 1( how many times it used.)}
const getTrendingTopics = unstable_cache(
    async () => {
        const result = await prisma.$runCommandRaw({
            aggregate: "posts", // Match your Prisma mapping for the posts collection
            pipeline: [
                {
                    $project: {
                        hashtags: {
                            $filter: {
                                input: { $split: ["$content", " "] }, // Split content by spaces
                                as: "word",
                                cond: { $regexMatch: { input: "$$word", regex: "^#[\\w_]+$" } } // Match words starting with #
                            }
                        }
                    }
                },
                { $unwind: "$hashtags" }, // Unwind the array of hashtags
                {
                    $group: {
                        _id: { $toLower: "$hashtags" }, // Group by lowercase hashtag
                        count: { $sum: 1 } // Count occurrences
                    }
                },
                {
                    $sort: {
                        count: -1, // Sort by count (desc)
                        _id: 1     // Sort alphabetically by hashtag (asc)
                    }
                },
                { $limit: 5 }, // Limit to top 5
                {
                    $project: {
                        hash: "$_id", // Return the hashtag
                        count: 1      // Return the count
                    }
                }
            ],
            cursor: {}
        });

        const firstBatch = (result as { cursor: { firstBatch: HashtagResult[] } }).cursor.firstBatch;
        return firstBatch;
    },
    ['treading_topics'],
    { revalidate: 3 * 60 * 60 } // count in seconds
)

async function TreadingTopics() {
    const trendingTopics = await getTrendingTopics()
    return (
        <div className=" space-y-3 rounded-xl bg-primary-foreground p-5 shadow-sm">
            <div className=" text-xl font-bold">Trending Topics</div>
            {
                trendingTopics.map(({ hash, count }) => {

                    const title = hash.split("#")[1]
                    return (
                        <Link key={title} href={`/hashtag/${title}`} className="block">
                            <p className=" line-clamp-1 text-sm break-all font-semibold hover:underline" title={hash}>{hash}</p>
                            <p className=" text-xs font-medium text-muted-foreground">{formatNumber(Number(count))} {Number(count) === 1 ? 'post' : 'posts'}</p>
                        </Link>
                    )
                })
            }

        </div>
    )
} 