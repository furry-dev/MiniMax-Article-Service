import UserForm from "@/components/forms/UserForm/UserForm"
import {UserEntityWithId} from "@/utils/UserManager/User.interfaces"

export default function User({userId}: { userId: string }) {
    let user: UserEntityWithId | undefined = undefined

    return (
        <div>
            <small>Користувач: {userId}</small>
            <UserForm user={user}/>
        </div>
    )
}