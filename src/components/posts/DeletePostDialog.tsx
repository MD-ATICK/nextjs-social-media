import { PostData } from '@/lib/types'
import LoadingButton from '../loadingButton'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { useDeletePostMutation } from './mutations'

interface Props {
    post: PostData,
    open: boolean,
    onClose: () => void,
}

export default function DeletePostDialog({ post, open, onClose }: Props) {

    const mutation = useDeletePostMutation()

    const handleOpenChange = (open: boolean) => {
        if (!open || !mutation.isPending) {
            onClose()
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Post?</DialogTitle>
                    <DialogDescription>Are you sure you want to delete this post?</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <LoadingButton variant={'destructive'}  isPending={mutation.isPending} onClick={() => mutation.mutate(post.id, { onSuccess: onClose })}>
                        Delete
                    </LoadingButton>
                    <Button variant={'outline'} onClick={onClose} disabled={mutation.isPending}>Cancel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
