import User from "@/components/screens/Admin/Users/User/User"
import {notFound} from "next/navigation"

export default function UserPage({params}: { params?: { id: string } }) {
    if (!params?.id) return notFound()

    return <User userId={params.id}/>
}