import styles from "./Users.module.sass"
import UsersTable from "@/components/screens/Admin/Users/UsersTable/UsersTable"
import Link from "next/link"

export default function Users() {
    return (
        <div className={styles.users}>
            <UsersTable/>
            <Link href={"/admin/users/new"} className={styles.addBtn}>+</Link>
        </div>
    )
}