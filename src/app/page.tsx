"use client"

import InvoicePage from "@/app/invoice/[id]/page"
import {useUser} from "@/context/UserContext"

export default function HomePage() {
    const user = useUser()

    switch (user?.role) {
    case "labeler":
        return <InvoicePage/>
    default:
        return <InvoicePage/>
    }
}
