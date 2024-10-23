import { Prisma } from "@prisma/client"

export function getUserDataSelect(loggedInUserId: string) {
    return {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
        followers: {
            where: {
                followerId: loggedInUserId
            },
            select: {
                followerId: true
            }
        },
        bookmarks: {
            where: {
                userId: loggedInUserId
            },
            select: {
                userId: true
            }
        },
        _count: {
            select: {
                posts: true,
                followers: true
            }
        },


    } satisfies Prisma.UserSelect
}


export function getPostDataInclude(loggedInUserId: string) {
    return {
        author: {
            select: getUserDataSelect(loggedInUserId)
        },
        attachments: true,
        likes: {
            where: { userId: loggedInUserId },
            select: { userId: true }
        },
        bookmarks: {
            where: { userId: loggedInUserId },
            select: { userId: true },
        },
        _count: {
            select: {
                likes: true,
                comments: true
            }
        },
    } satisfies Prisma.PostInclude
}

export const userDataSelect = {
    id: true,
    username: true,
    displayName: true,
    avatarUrl: true
} satisfies Prisma.UserSelect

export const PostDataInclude = {
    author: {
        select: userDataSelect
    }
} satisfies Prisma.PostInclude


export type PostData = Prisma.PostGetPayload<{
    include: ReturnType<typeof getPostDataInclude>
}>
export type UserData = Prisma.UserGetPayload<{
    select: ReturnType<typeof getUserDataSelect>
}>


export function getCommentDataInclude(loggedInUserId: string) {
    return {
        user: {
            select: getUserDataSelect(loggedInUserId)
        }
    } satisfies Prisma.CommentInclude;
}

export type CommentData = Prisma.CommentGetPayload<{
    include: ReturnType<typeof getCommentDataInclude>
}>

export interface CommentPage {
    comments: CommentData[],
    previousCursor: string | null
}

export interface PostsPage {
    posts: PostData[],
    nextCursor: string | null
}
export interface PostsPage {
    posts: PostData[],
    nextCursor: string | null
}

export interface FollowerInfo {
    followers: number,
    isFollowedByUser: boolean
}


export interface LikeInfo {
    likes: number,
    isLikedByUser: boolean
}


export interface BookmarkInfo {
    isBookmarkByUser: boolean
}


export const notificationInclude = {
    issuer: {
        select : {
            username : true, 
            avatarUrl : true,
            displayName : true
        }
    },
    post : {
        select : {
            content : true
        }
    }

} satisfies Prisma.NotificationInclude

export type notificationData = Prisma.NotificationGetPayload<{
    include : typeof notificationInclude
}>

export interface NotificationPage {
    notifications: notificationData[],
    nextCursor: string | null
}


export type NotificationUnreadCountProps = {
    unreadCount : number
}
export type MessageUnreadCountType = {
    unreadCount : number
}