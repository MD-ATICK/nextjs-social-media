import loadingImage from '@/assets/loading.png'
import Image from 'next/image'


export default function Loading() {
    return (
        <div className=' flex justify-center items-center h-10 w-full'>
            <Image src={loadingImage} height={20} className=" animate-spin" alt="" />
        </div>
    )
}
