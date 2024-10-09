"use client"

import {InvoiceType, InvoiceWithId} from "@/utils/InvoiceManager/Invoice.interfaces"
import InvoiceCard from "@/components/cards/InvoiceCard/InvoiceCard"
import styles from "./InvoicesList.module.sass"
import {useEffect, useRef, useState} from "react"
import {InvoiceManager} from "@/utils/InvoiceManager/InvoiceManager"
import Link from "next/link"
import {useUser} from "@/context/UserContext"
import {userIsAdmin, userIsCashbox, userIsDeveloper, userIsWholesale} from "@/utils/userRoles"

const DEFAULT_PAGE_LIMIT = 20

export default function InvoicesList({type, closedAt, pageLimit}: {
    type?: "Archive" | "Opened",
    closedAt?: number,
    pageLimit?: number
}) {
    const [invoices, setInvoices] = useState<InvoiceWithId[]>([])

    const listRef = useRef<HTMLUListElement | null>(null)

    const user = useUser()

    useEffect(() => {
        const keyboardHandler = (e: KeyboardEvent) => {
            if (e.code === "KeyZ") {
                listRef.current?.querySelector("a")?.focus()
            }
        }

        document.addEventListener("keydown", keyboardHandler)
        return () => document.removeEventListener("keydown", keyboardHandler)
    }, [])

    useEffect(() => {
        if (type === "Archive") {
            InvoiceManager.getArchive(pageLimit || DEFAULT_PAGE_LIMIT, closedAt).then(value => setInvoices(value))
        } else {
            let invoiceTypeFilter: InvoiceType | undefined = undefined

            if (userIsDeveloper(user) || userIsAdmin(user)) {
                invoiceTypeFilter = undefined
            } else if (userIsCashbox(user)) {
                invoiceTypeFilter = "retail"
            } else if (userIsWholesale(user)) {
                invoiceTypeFilter = "wholesale"
            }

            return InvoiceManager.subscribeToInvoices(setInvoices, invoiceTypeFilter)
        }
    }, [closedAt, pageLimit, type, user])

    const loadMoreHandler = () => {
        InvoiceManager.getArchive(pageLimit || DEFAULT_PAGE_LIMIT, invoices[invoices.length - 1].closedAt).then(value => {
            setInvoices(oldInvoices => [...oldInvoices, ...value])
        })
    }

    return (
        <ul className={styles.list} ref={listRef}>
            {invoices.map((invoice, index) => (
                <li key={index}>
                    <InvoiceCard invoice={invoice}/>
                </li>
            ))}
            {invoices.length < 1 && <span>Нічого немає...</span>}
            {type !== "Archive" && (<Link className={styles.archiveBtn} href={"/archive"}>Архів</Link>)}
            {type === "Archive" &&
                <button className={styles.loadMoreBtn} onClick={loadMoreHandler}>Завантажити ще...</button>}
        </ul>
    )
}
