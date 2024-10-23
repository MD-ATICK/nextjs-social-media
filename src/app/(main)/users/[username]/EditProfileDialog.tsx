"use client"

import placeHolderImage from '@/assets/girl.jpg'
import CropImageDialog from '@/components/CropImageDialog'
import LoadingButton from "@/components/loadingButton"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { UserData } from "@/lib/types"
import { updateUserProfileSchema, UpdateUserProfileValues } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import Image, { StaticImageData } from "next/image"
import { useRef, useState } from "react"
import { useForm } from 'react-hook-form'
import Resizer from 'react-image-file-resizer'
import { useUpdateUserProfileMutation } from "./mutations"


export default function EditProfileDialog({ user }: { user: UserData }) {

    const [showProfile, setShowProfile] = useState(false);
    const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null);

    const form = useForm<UpdateUserProfileValues>({
        resolver: zodResolver(updateUserProfileSchema),
        defaultValues: {
            displayName: user.displayName,
            bio: user.bio || '',
        }
    })


    const { isPending, error, mutate } = useUpdateUserProfileMutation()

    async function onsubmit(values: UpdateUserProfileValues) {

        const newAvatarFile = croppedAvatar ? new File([croppedAvatar], `avatar_${user.id}.webp`) : undefined

        mutate({ values, avatar: newAvatarFile }, {
            onSuccess: () => {
                setCroppedAvatar(null)
                setShowProfile(false)
            }
        })
    }

    return (
        <Dialog open={showProfile} onOpenChange={setShowProfile}>
            <DialogTrigger asChild>
                <Button variant={'default'}>
                    Edit Profile
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae maxime in optio, incidunt laboriosam minus?</DialogDescription>
                <div className=" space-y-2">
                    <Label>Avatar</Label>
                    <AvatarImage
                        src={croppedAvatar ? URL.createObjectURL(croppedAvatar) : user.avatarUrl || placeHolderImage}
                        onImageCropped={setCroppedAvatar}
                    />
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onsubmit)} className=" space-y-4 my-4">

                        <FormField
                            control={form.control}
                            name="displayName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className=" flex items-center gap-1">Display Name <FormMessage /></FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} placeholder=" display name" {...field} />
                                    </FormControl>

                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className=" flex items-center gap-1">Bio <FormMessage /></FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="tell about little bit about your self" className=" resize-none" {...field} />
                                    </FormControl>

                                </FormItem>
                            )}
                        />
                        {
                            error &&
                            <p className=" h-10 w-full rounded-lg bg-[#f2a8a8] text-sm text-red-600 flex justify-center items-center" >{error.message}</p>
                        }
                        <LoadingButton type='submit' className=" w-full" isPending={isPending} disabled={isPending}>Update Profile</LoadingButton>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}


interface AvatarImageProps {
    src: string | StaticImageData,
    onImageCropped: (blob: Blob | null) => void
}

function AvatarImage({ src, onImageCropped }: AvatarImageProps) {

    const [imageToCrop, setImageToCrop] = useState<File>();

    const fileInputRef = useRef<HTMLInputElement>(null)

    const onImageSelected = (image: File | undefined) => {
        if (!image) return;

        Resizer.imageFileResizer(image, 1024, 1024, "WEBP", 100, 0,
            (uri) => setImageToCrop(uri as File), "file"
        )
    }

    return (
        <div className="relative w-full h-32 flex items-center justify-center rounded-full bg-gray-200">
            <input
                type="file"
                accept="image/png, image/jpeg"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                        onImageSelected(file)
                    }
                }}
            />
            <button type="button" onClick={() => fileInputRef.current?.click()} className=" h-40 aspect-square relative block group">
            <Image
                    src={src}
                    alt='User Avatar'
                    fill
                    sizes="200px"
                    className={'aspect-square h-fit flex-none rounded-full bg-secondary object-cover'}
                />
                {/* <Image src={src} height={150} width={150} className=' rounded-full aspect-square object-cover' alt='' /> */}
            </button>
            {
                imageToCrop &&
                <CropImageDialog
                    src={URL.createObjectURL(imageToCrop)}
                    cropAspectRatio={1}
                    onCropped={onImageCropped}
                    onClose={() => {
                        setImageToCrop(undefined)
                        if (fileInputRef.current) {
                            fileInputRef.current.value = ""
                        }
                    }}
                />
            }
        </div>
    )

}