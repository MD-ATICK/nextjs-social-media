import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import MenuBar from "./MenuBar";
import Navbar from "./Navbar";
import SessionProvider from "./SessionProvider";


export default async function Layout({ children }: { children: ReactNode }) {


    const session = await validateRequest();

    if (!session.user) redirect('/login');


    return (
        <SessionProvider value={session}>
            <Navbar />
            <div className=" flex container mx-auto min-h-[calc(100vh-115px)] md:p-2 gap-5 pb-0">
                <MenuBar className=" hidden sm:block w-fit lg:w-[200px] h-fit sticky top-24 space-y-1 left-0 grow" />
                {children}
            </div>
            <MenuBar className=" sm:hidden sticky bottom-0 h-12 bg-primary-foreground border-t-2  flex items-center justify-between px-[10vw] w-full" />
        </SessionProvider>
    )
}

