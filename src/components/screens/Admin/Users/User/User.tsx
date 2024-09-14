import UserForm from "@/components/forms/UserForm/UserForm"
import {UserEntityWithId} from "@/utils/UserManager/User.interfaces"
import {GetUser} from "@/utils/UserManager/UserManager"
import {notFound} from "next/navigation"

export default async function User({userId}: { userId?: string }) {
    let user: UserEntityWithId | undefined = undefined

    if (userId) {
        user = await GetUser(userId)
        if (!user) return notFound()
    }

    return (
        <div>
            <small>Користувач: {userId}</small>
            <UserForm user={user}/>
        </div>
    )
}