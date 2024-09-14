"use client"
import {USER_ROLES_DICT, UserEntityWithId} from "@/utils/UserManager/User.interfaces"
import Image from "next/image"

import styles from "./UserRow.module.sass"
import {useRouter} from "next/navigation"

export default function UserRow({user}: { user: UserEntityWithId }) {

    const router = useRouter()

    const onClickHandler = () => {
        router.push(`/admin/users/${user.id}`)
    }

    return (
        <tr className={styles.userRow} onClick={onClickHandler}>
            <td>
                <Image
                    src={`/images/avatars/${user.avatar || "empty-avatar.png"}`}
                    alt={user.name}
                    width={32}
                    height={32}
                />
            </td>
            <td>{user.name}</td>
            <td>{USER_ROLES_DICT[user.role]}</td>
        </tr>
    )
}