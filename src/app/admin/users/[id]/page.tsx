import User from "@/components/screens/Admin/Users/User/User"

export default function UserPage({params}: { params?: { id: string } }) {
    return <User userId={params?.id}/>
}