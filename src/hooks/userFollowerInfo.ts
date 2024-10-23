import kyInstance from "@/lib/ky";
import { FollowerInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export default function useFollowerInfo(userId: string, initialState: FollowerInfo) {
    const query = useQuery({
        queryKey: ['follower-info', userId],
        queryFn: () => kyInstance.get(`/api/users/${userId}/followers`).json<FollowerInfo>(),
        initialData: initialState,
        staleTime: Infinity // means it not auto call before i make any knock
    });

    return query;
}

