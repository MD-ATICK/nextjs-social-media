import 'cropperjs/dist/cropper.css'
import { useRef } from 'react'
import { Cropper, ReactCropperElement } from 'react-cropper'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'

interface props {
    src: string,
    cropAspectRatio: number,
    onCropped: (bold: Blob | null) => void,
    onClose: () => void
}
export default function CropImageDialog({ src, cropAspectRatio, onClose, onCropped }: props) {

    const cropperRef = useRef<ReactCropperElement>(null)

    const crop = () => {
        const cropper = cropperRef.current?.cropper
        if (!cropper) return;

        cropper.getCroppedCanvas().toBlob((blob) => onCropped(blob), 'image/webp')
        onClose()
    }

    
    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crop Image</DialogTitle>
                </DialogHeader>

                <div className=' max-h-[75vh] w-full overflow-y-scroll'>

                <Cropper
                    src={src}
                    aspectRatio={cropAspectRatio}
                    height={500}
                    width={500}
                    guides={false}
                    zoomable={false}
                    ref={cropperRef}
                    className=' mx-auto size-fit'
                />
                </div>
                <DialogFooter>
                    <Button variant={'secondary'} onClick={onClose}>Cancel</Button>
                    <Button onClick={crop}>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
