"use client"

import searchImage from '@/assets/search.png'
import Image from "next/image"
import { useRouter } from "next/navigation"
import { FormEvent } from "react"
import { Input } from "./ui/input"

export default function SearchField() {

    const router = useRouter()

    const onsubmit = async (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget;
        const query = (form.query as HTMLInputElement).value.trim()
        if(!query) return;

        router.push(`/search?q=${encodeURIComponent(query)}`)
    }

  return (
    <form onSubmit={onsubmit} method='GET' action={'/search'}>
        <div className=" relative w-full sm:w-[40vw] rounded-full border bg-gray-200 dark:bg-primary-foreground">
            <Input placeholder="Search" name="query" className=" w-full rounded-full pr-10" />
            <Image src={searchImage} height={15} className=' invert dark:invert-0 absolute right-4 top-1/2 -translate-y-1/2' alt="" />
        </div>
    </form>
  )
}
