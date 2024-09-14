"use client"

import Link from "next/link"
import Image from "next/image"

import styles from "./AdminNavigation.module.sass"
import {usePathname} from "next/navigation"

interface LinkEntity {
    name: string
    url: string[]
    icon?: string
}

const ADMIN_PAGES: LinkEntity[] = [
    {
        name: "Користувачі",
        url: [
            "/admin/users",
            "/admin"
        ],
        icon: "users.png",
    }
]

export default function AdminNavigation() {

    const pathname = usePathname()

    return (
        <nav className={styles.nav}>
            <ul>
                {ADMIN_PAGES.map(page => (
                    <li key={page.name}>
                        <Link href={page.url[0]}
                            className={`${styles.link} ${page.url.includes(pathname) ? styles.active : ""}`}>
                            {page.icon && <Image src={`/icons/${page.icon}`} alt={page.name} width={32} height={32}/>}
                            {page.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}