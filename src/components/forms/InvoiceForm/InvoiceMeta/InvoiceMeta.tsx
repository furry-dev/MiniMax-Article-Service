"use client"

import styles from "./InvoiceMeta.module.sass"
import React, {useEffect} from "react"
import {InvoiceWithId} from "@/utils/InvoiceManager/Invoice.interfaces"
import {GetUser} from "@/utils/UserManager/UserManager"
import {USER_ROLES_DICT, UserEntity} from "@/utils/UserManager/User.interfaces"

export default function InvoiceMeta({invoice}: { invoice: InvoiceWithId }) {
    const [user, setUser] = React.useState<UserEntity | null>(null)

    useEffect(() => {
        const userData = new FormData()
        userData.set("uid", invoice.createBy)

        GetUser(userData).then(value => {
            if (!value) return false
            setUser(value)
        })
    }, [invoice.createBy])


    return (
        <div className={styles.meta}>
            <h2>{invoice.name} | <small>id: {invoice.id}</small></h2>
            <span>Створено: {user?.name}{user?.role && <>({USER_ROLES_DICT[user?.role]})</>}</span>
            <span>Всього позицій: {invoice.products?.length || 0}</span>
            {invoice.closedAt &&
                <small className={styles.closed}>Closed at: {new Date(invoice.closedAt).toLocaleString()}</small>}
        </div>
    )
}