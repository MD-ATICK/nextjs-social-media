import { CommentData } from '@/lib/types'
import LoadingButton from '../loadingButton'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { useDeleteCommentMutation } from './mutations'

interface Props {
    comment: CommentData,
    open: boolean,
    onClose: () => void,
}

export default function DeleteCommentDialog({ comment, open, onClose }: Props) {

    const mutation = useDeleteCommentMutation()

    const handleOpenChange = (open: boolean) => {
        if (!open || !mutation.isPending) {
            onClose()
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Comment?</DialogTitle>
                    <DialogDescription>Are you sure you want to delete this comment?</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <LoadingButton variant={'destructive'}  isPending={mutation.isPending} onClick={() => mutation.mutate(comment.id, { onSuccess: onClose })}>
                        Delete
                    </LoadingButton>
                    <Button variant={'outline'} onClick={onClose} disabled={mutation.isPending}>Cancel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
