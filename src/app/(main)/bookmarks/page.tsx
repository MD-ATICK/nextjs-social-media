import TrendsSideBar from '@/components/TrendsSideBar'
import { Metadata } from 'next'
import Bookmarks from './Bookmarks'


export const metadata: Metadata = {
    title: 'Bookmarks'
}
export default function page() {
    return (
        <main className=' w-full flex min-w-0 gap-5'>
            <div className=' w-full min-w-0 space-y-5'>
                <div className=' rounded-2xl bg-primary-foreground p-5 shadow-sm'>
                    <h1 className=' text-center text-2xl font-bold'>Bookmarks</h1>
                </div>
                <Bookmarks />
            </div>
            <TrendsSideBar />
        </main>
    )
}
