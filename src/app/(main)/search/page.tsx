import TrendsSideBar from '@/components/TrendsSideBar'
import { Metadata } from 'next'
import SearchResults from './SearchResults'

interface props {
    searchParams : {q : string}
}
export function generateMetadata({searchParams : {q}} : props) : Metadata {
    return {
        title: `Search results for "${q}"`
    }
}

export default function page({searchParams : {q}} : props) {
    return (
        <main className=' w-full flex min-w-0 gap-5'>
            <div className=' w-full min-w-0 space-y-5'>
                <div className=' rounded-2xl bg-primary-foreground p-5 shadow-sm'>
                    <h1 className=' text-center text-xl font-semibold'>Search Result For &quot;{q}&quot;</h1>
                </div>
                <SearchResults query={q} />
            </div>
            <TrendsSideBar />
        </main>
    )
}
