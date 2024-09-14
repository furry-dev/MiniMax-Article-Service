import styles from "./UsersTable.module.sass"
import {UserEntityWithId} from "@/utils/UserManager/User.interfaces"
import UserRow from "@/components/screens/Admin/Users/UsersTable/UserRow/UserRow"

const USERS: UserEntityWithId[] = [
    {
        id: "sds",
        name: "Максим",
        password: "",
        role: "developer",
        avatar: "developer.png"
    }
]

export default function UsersTable({className}: { className?: string }) {
    return (
        <table className={`${styles.table} ${className || ""}`}>
            <thead>
                <tr>
                    <th>Avatar</th>
                    <th>Name</th>
                    <th>Role</th>
                </tr>
            </thead>
            <tbody>
                {USERS.map(user => <UserRow user={user} key={user.id}/>)}
            </tbody>
        </table>
    )
}