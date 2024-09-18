"use client"

import InvoicesList from "@/components/lists/InvoicesList/InvoicesList"
import InvoiceForm from "@/components/forms/InvoiceForm/InvoiceForm"

import styles from "./Invoice.module.sass"
import NewInvoiceBtn from "@/components/lists/InvoicesList/NewInvoiceBtn/NewInvoiceBtn"
import {useEffect, useState} from "react"
import {InvoiceWithId} from "@/utils/InvoiceManager/Invoice.interfaces"
import {InvoiceManager} from "@/utils/InvoiceManager/InvoiceManager"
import toast from "react-hot-toast"
import {useRouter} from "next/navigation"
import {useUser} from "@/context/UserContext"
import {userIsCashbox, userIsConsultant} from "@/utils/userRoles"

export default function Invoice({invoiceId}: { invoiceId?: string }) {
    const [invoice, setInvoice] = useState<InvoiceWithId | null>(null)

    const user = useUser()

    const router = useRouter()

    useEffect(() => {
        if (invoiceId) return InvoiceManager.subscribeToInvoiceById(invoiceId, setInvoice)
    }, [invoiceId])

    const closeInvoiceHandler = () => {
        if (!invoiceId) return

        toast.promise(
            InvoiceManager.closeInvoice(invoiceId),
            {
                loading: "Закривається...",
                success: "Успішно!",
                error: "Не вдалося закрити накладну!"
            }
        ).then(() => router.push("/"))
    }

    return (
        <main className={styles.main}>
            <div className={`${styles.list} ${invoiceId ? styles.activeInvoice : ""}`}>
                <InvoicesList/>
                {userIsConsultant(user) && <NewInvoiceBtn className={styles.addButton}/>}
            </div>
            {invoiceId && (
                <div className={styles.form}>
                    {invoice && <InvoiceForm invoice={invoice}/>}
                    {(!invoice?.closedAt && userIsCashbox(user)) && (
                        <button
                            className={styles.closeInvoiceBtn}
                            onClick={closeInvoiceHandler}
                            id={"closeInvoiceBtn"}
                        >
                            Закрити накладну
                        </button>
                    )}
                </div>
            )}
        </main>
    )
}