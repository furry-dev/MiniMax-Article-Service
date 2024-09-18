import AdminNavigation from "@/components/screens/Admin/AdminNavigation/AdminNavigation"
import {ReactNode} from "react"

import "./globals.sass"

export default function Layout({children}: { children: ReactNode }) {
    return (
        <main>
            <AdminNavigation/>
            {children}
        </main>
    )
}
