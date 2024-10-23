import logo from '@/../public/logo.png';
import SearchField from "@/components/SearchField";
import UserButton from "@/components/userButton";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className=" h-16 sm:h-20 sticky top-0 z-20  backdrop-blur-lg px-2 bg-white dark:bg-[#0000007b] border-b-2">
      <div className="flex justify-between items-center gap-3 container mx-auto h-full">
        <Link href={'/'} className='flex items-center gap-2'>
          <Image src={logo} height={30} alt="" />
          <div className=" hidden xs:block font-bold text-2xl sm:text-3xl text-primary">
            BugBook
          </div>
        </Link>
        <SearchField />
        <UserButton />
      </div>
    </header>
  )
}
