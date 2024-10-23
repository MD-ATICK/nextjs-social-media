import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className=" flex justify-center font-medium flex-col space-y-4 text-center items-center h-screen w-full">
      <h1 className=" text-3xl font-bold">Page not found!</h1>
      <p className=" text-muted-foreground text-sm">The page which you are looking for does not exist!</p>
      <Link href={'/'}>
        <Button variant={'secondary'}>
          Back to Home
        </Button>
      </Link>

    </div>
  )
}
