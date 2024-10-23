import TrendsSideBar from '@/components/TrendsSideBar'
import { Metadata } from 'next'
import Notifications from './Notifications'


export const metadata: Metadata = {
    title: 'Notifications'
}
export default function page() {
    return (
        <main className=' w-full flex min-w-0 gap-5'>
            <div className=' w-full min-w-0 space-y-5'>
                <div className=' rounded-2xl bg-primary-foreground p-5 shadow-sm'>
                    <h1 className=' text-center text-2xl font-bold'>Notifications</h1>
                </div>
                <Notifications />
            </div>
            <TrendsSideBar />
        </main>
    )
}
