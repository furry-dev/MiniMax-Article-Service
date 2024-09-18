"use client"

import styles from "./NewInvoiceBtn.module.sass"
import {InvoiceManager} from "@/utils/InvoiceManager/InvoiceManager"
import {useRouter} from "next/navigation"
import toast from "react-hot-toast"
import {useUser} from "@/context/UserContext"
import {userIsConsultant} from "@/utils/userRoles"

export default function NewInvoiceBtn({className}: { className?: string }) {
    const router = useRouter()
    const user = useUser()


    const onClickHandler = () => {
        if (!user || !userIsConsultant(user)) {
            toast.error("Нема доступу!")
            return router.push("/login")
        }

        toast.promise(InvoiceManager.createInvoice(user.uid), {
            loading: "Створення...",
            success: "Успішно!",
            error: "Помилка!"
        }).then((value) => {
            router.push(`/invoice/${value}`)
        })
    }

    return <button onClick={onClickHandler} className={`${styles.addButton} ${className || ""}`}>+</button>
}