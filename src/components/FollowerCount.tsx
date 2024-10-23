"use client"
import useFollowerInfo from '@/hooks/userFollowerInfo'
import { FollowerInfo } from '@/lib/types'
import { formatNumber } from '@/lib/utils'


interface props {
    userId: string,
    initialState: FollowerInfo
}
export default function FollowerCount({ userId, initialState }: props) {

    const { data } = useFollowerInfo(userId, initialState)

    return (
        <span>
            Followers: {" "}
            <span className=' font-semibold'>{formatNumber(data.followers)}</span>
        </span>
    )
}
