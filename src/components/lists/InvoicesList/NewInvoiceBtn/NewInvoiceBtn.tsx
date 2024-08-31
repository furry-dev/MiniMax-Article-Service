"use client"

import styles from "./NewInvoiceBtn.module.sass"
import {InvoiceManager} from "@/utils/InvoiceManager/InvoiceManager"
import {useRouter} from "next/navigation"
import toast from "react-hot-toast"

export default function NewInvoiceBtn({className}: { className?: string }) {
    const router = useRouter()

    const onClickHandler = () => {
        toast.promise(InvoiceManager.createInvoice(), {
            loading: "Створення...",
            success: "Успішно!",
            error: "Помилка!"
        }).then((value) => {
            router.push(`/invoice/${value}`)
        })
    }

    return <button onClick={onClickHandler} className={`${styles.addButton} ${className || ""}`}>+</button>
}