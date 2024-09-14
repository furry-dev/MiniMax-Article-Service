import styles from "./UsersTable.module.sass"
import UserRow from "@/components/screens/Admin/Users/UsersTable/UserRow/UserRow"
import {GetUsers} from "@/utils/UserManager/UserManager"

export default async function UsersTable({className}: { className?: string }) {
    const users = await GetUsers()

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
                {users.map(user => <UserRow user={user} key={user.id}/>)}
            </tbody>
        </table>
    )
}