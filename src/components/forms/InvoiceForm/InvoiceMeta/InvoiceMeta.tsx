"use client"

import styles from "./InvoiceMeta.module.sass"
import React, {useEffect} from "react"
import {InvoiceWithId, isInvoiceType} from "@/utils/InvoiceManager/Invoice.interfaces"
import {GetUser} from "@/utils/UserManager/UserManager"
import {USER_ROLES_DICT, UserEntity} from "@/utils/UserManager/User.interfaces"
import {InvoiceManager} from "@/utils/InvoiceManager/InvoiceManager"
import toast from "react-hot-toast"

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


    const changeInvoiceTypeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (invoice.closedAt) return false

        const type = e.target.value

        if (!isInvoiceType(type)) return toast.error("Невідома помилка!")

        void toast.promise(InvoiceManager.changeInvoiceType(invoice.id, type), {
            loading: "Збереження...",
            success: "Тип змінено!",
            error: "Помилка!"
        })
    }

    return (
        <div className={styles.meta}>
            <h2>{invoice.name} | <small>id: {invoice.id}</small></h2>
            <div className={styles.info}>
                <div className={styles.left}>
                    <span>Створено: {user && <>{user.name}({USER_ROLES_DICT[user.role]})</>}</span>
                    <span>Всього позицій: {invoice.products?.length || 0}</span>
                    {invoice.closedAt &&
                        <small className={styles.closed}>Closed
                            at: {new Date(invoice.closedAt).toLocaleString()}</small>}
                </div>
                <div className={styles.right}>
                    <select
                        name="type"
                        className={styles.type}
                        value={invoice.invoiceType}
                        onChange={changeInvoiceTypeHandler}
                        disabled={Boolean(invoice.closedAt)}
                    >
                        <option value="retail">Роздріб</option>
                        <option value="wholesale">Опт</option>
                    </select>
                </div>
            </div>
        </div>
    )
}