"use client"
import { useSession } from '@/app/(main)/SessionProvider'
import imageHill from '@/assets/image.png'
import loadingImage from '@/assets/loading.png'
import LoadingButton from '@/components/loadingButton'
import { Button } from '@/components/ui/button'
import UserAvatar from '@/components/userAvatar'
import { cn } from '@/lib/utils'
import PlaceHolder from '@tiptap/extension-placeholder'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useDropzone } from '@uploadthing/react'
import Image from 'next/image'
import { ClipboardEvent, useRef } from 'react'
import useSubmitPostMutation from './mutations'
import './styles.css'
import useMediaUpload, { Attachment } from './useMediaUpload'


export function PostEditor() {

    const { user } = useSession()
    const mutation = useSubmitPostMutation()


    const {
        isUploading,
        uploadProgress,
        attachments,
        reset: resetMediaUpload,
        removeAttachment,
        startUpload
    } = useMediaUpload()

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: startUpload
    })

    const { ...rootProps } = getRootProps()

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bold: false,
                italic: false
            }),
            PlaceHolder.configure({
                placeholder: "What's crack-a-lackin'?"
            })
        ]
    })

    const input = editor?.getText({
        blockSeparator: "\n"
    }) || ""

    const onsubmit = () => {
        mutation.mutate({
            content: input,
            mediaIds: attachments.map(a => a.mediaId).filter(Boolean) as string[]
        }, {
            onSuccess: () => {
                editor?.commands.clearContent();
                resetMediaUpload();
            }
        })
    }


    function onPaste(e: ClipboardEvent<HTMLInputElement>) {
        const files = Array.from(e.clipboardData.items)
            .filter(item => item.kind === 'file')
            .map(item => item.getAsFile()) as File[]

        startUpload(files)
    }

    return <div className=' flex flex-col gap-5 rounded-2xl bg-primary-foreground p-5 shadow-lg' >
        <div className=' flex gap-5'>
            <UserAvatar avatarUrl={user?.avatarUrl} className=' hidden sm:inline' />
            <div {...rootProps} className=' w-full'>
                <EditorContent
                    editor={editor}
                    onPaste={onPaste}
                    className={cn(' w-full max-h-[15rem] bg-background p-2 rounded-xl overflow-y-scroll border-blue-950', isDragActive && 'outline-dashed')}
                />
                <input type='hidden' {...getInputProps} />
            </div>
        </div>
        {
            !!attachments.length && (
                <AttachmentPreviews
                    attachments={attachments}
                    removeAttachment={removeAttachment}
                />
            )
        }
        <div className=' flex justify-end items-center gap-3'>
            {
                isUploading && (
                    <>
                        <span className=' font-medium text-sm'>{uploadProgress ?? 0}%</span>
                        <Image src={loadingImage} height={20} className=" animate-spin" alt="" />

                    </>
                )
            }
            <AddAttachmentButton onFileSelected={startUpload} disabled={isUploading || attachments.length >= 5} />
            <LoadingButton
                isPending={mutation.isPending}
                onClick={onsubmit}
                disabled={!input.trim() || mutation.isPending || isUploading}
                className='min-w-20'
            >
                Post
            </LoadingButton>
        </div>
    </div>
}


interface AddAttachmentButtonProps {
    onFileSelected: (files: File[]) => void,
    disabled: boolean
}

function AddAttachmentButton({ onFileSelected, disabled }: AddAttachmentButtonProps) {

    const fileInputRef = useRef<HTMLInputElement>(null)

    return <>
        <Button size={'icon'} disabled={disabled} onClick={() => fileInputRef.current?.click()} variant={'outline'} className=' h-11 w-11 p-1 rounded-full'>
            <Image src={imageHill} height={20} alt='' className=' dark:invert' />
        </Button>
        <input type="file" accept='image/* video/*' multiple ref={fileInputRef} className=' hidden sr-only'
            onChange={(e) => {
                const files = Array.from(e.target.files || [])
                if (files.length) {
                    onFileSelected(files)
                    e.target.value = ''
                }
            }}
        />
    </>
}




interface AttachmentPreviewsProps {
    attachments: Attachment[],
    removeAttachment: (fileName: string) => void
}

function AttachmentPreviews({ attachments, removeAttachment }: AttachmentPreviewsProps) {
    return (
        <div className={cn(' flex flex-col gap-3', attachments.length > 1 && 'sm:grid sm:grid-cols-2')}>
            {
                attachments.map(attachment => (
                    <AttachmentPreview
                        key={attachment.file.name}
                        attachment={attachment}
                        onRemoveClick={() => removeAttachment(attachment.file.name)}
                    />
                ))
            }
        </div>
    )
}

interface AttachmentPreviewProps {
    attachment: Attachment,
    onRemoveClick: () => void
}

function AttachmentPreview({ attachment: { file, isUploading }, onRemoveClick }: AttachmentPreviewProps) {

    const src = URL.createObjectURL(file)

    return <div className={cn('relative mx-auto size-fit', isUploading && ' opacity-50')}>
        {
            file.type.startsWith('image') ? (
                <Image
                    src={src}
                    alt='Attachment preview'
                    width={300}
                    height={300}
                    className=' size-fit max-h-[25rem] rounded-2xl'
                />
            ) : (
                <video controls className=' size-fit max-h-[30rem] rounded-2xl'>
                    <source src={src} type={file.type} />
                </video>
            )
        }
        {!isUploading && (
            <button onClick={onRemoveClick} className=' h-10 aspect-square font-medium backdrop-blur-lg absolute right-3 text-lg top-3 rounded-full  bg-[#0505059b]  p-1 text-background transition-colors hover:opacity-80'>
                X
            </button>
        )}
    </div>
}