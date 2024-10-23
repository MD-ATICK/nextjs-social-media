"use client"
import { ClipLoader } from "react-spinners";

interface props {
  isPending : boolean
}

export default function LoadingGlobal({isPending} : props) {

  if(!isPending) return;

  return (
    <div className=" fixed top-4 right-4">
        <ClipLoader size={20} color="white" />
    </div>
  )
}
