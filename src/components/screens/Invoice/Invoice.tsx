"use client"

import InvoicesList from "@/components/lists/InvoicesList/InvoicesList"
import InvoiceForm from "@/components/forms/InvoiceForm/InvoiceForm"

import styles from "./Invoice.module.sass"
import NewInvoiceBtn from "@/components/lists/InvoicesList/NewInvoiceBtn/NewInvoiceBtn"
import React, {useEffect, useState} from "react"
import {InvoiceWithId, ProductEntity} from "@/utils/InvoiceManager/Invoice.interfaces"
import {InvoiceManager} from "@/utils/InvoiceManager/InvoiceManager"
import toast from "react-hot-toast"
import {useRouter} from "next/navigation"
import {useUser} from "@/context/UserContext"
import {userIsCashbox, userIsConsultant} from "@/utils/userRoles"
import useConfirm from "@/components/base/ConfirmDialog/ConfirmDialog"
import {STATUS_LIST} from "@/components/forms/InvoiceForm/ProductsTable/Product/StatusBtn/StatusBtn"

export default function Invoice({invoiceId}: { invoiceId?: string }) {
    const [invoice, setInvoice] = useState<InvoiceWithId | null>(null)

    const notDeliveredProducts = invoice?.products?.filter(product => product.status !== "Delivered")

    const user = useUser()

    const router = useRouter()

    const {confirm, ConfirmDialogComponent} = useConfirm()

    useEffect(() => {
        if (invoiceId) return InvoiceManager.subscribeToInvoiceById(invoiceId, setInvoice)
    }, [invoiceId])

    const closeInvoice = (invoiceId: string) => {
        toast.promise(
            InvoiceManager.closeInvoice(invoiceId),
            {
                loading: "Закривається...",
                success: "Успішно!",
                error: "Не вдалося закрити список!"
            }
        ).then(() => router.push("/"))
    }

    const payInvoiceHandler = () => {
        if (!invoiceId) return

        if (!invoice?.products || invoice.products.length === 0) return toast.error("Список не містить жодної позиції!")

        toast.promise(
            InvoiceManager.payInvoice(invoiceId),
            {
                loading: "Оплата...",
                success: "Успішно!",
                error: "Не вдалося сплатити список!"
            }
        ).then(async () => {
            if (notDeliveredProducts && notDeliveredProducts.length === 0) {
                await confirm(
                    "Усі товари видані, закрити список?",
                    [
                        {
                            text: "Не закривати", keyCode: "Escape"
                        },
                        {
                            text: "Закрити", onclick: () => closeInvoice(invoiceId), keyCode: "Enter"
                        }
                    ]
                )
            }
            router.push("/")
        })
    }

    const closeInvoiceHandler = async () => {
        if (!invoiceId || !invoice) return

        if (!invoice.paidAt) return toast.error("Список не проплачено!")

        if (!invoice.products || invoice.products.length === 0) return toast.error("Список не містить жодної позиції!")

        const changeStatusAndCloseInvoiceHandler = () => {
            if (!invoice.products || invoice.products.length === 0) return toast.error("Список не містить жодної позиції!")

            const updatedProducts: ProductEntity[] = invoice.products.map(product => ({
                ...product,
                status: "Delivered"
            }))

            toast.promise(InvoiceManager.updateInvoiceProducts(invoiceId, updatedProducts), {
                loading: "Зміна статуса...",
                success: "Успішно!",
                error: "Помилка!"
            })

            closeInvoice(invoiceId)
        }


        if (notDeliveredProducts && notDeliveredProducts.length > 0) {
            await confirm(
                "Не всі товари видані! Змінити статус та закрити накладну?",
                [
                    {
                        text: "Не закривати", keyCode: "Escape"
                    },
                    {
                        text: "Закрити", onclick: changeStatusAndCloseInvoiceHandler, keyCode: "Enter"
                    }
                ],
                (
                    <div className={styles.notDeliveredProducts}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Артикул</th>
                                    <th>Назва</th>
                                    <th>к-сть</th>
                                    <th>Статус</th>
                                </tr>
                            </thead>
                            <tbody>
                                {notDeliveredProducts.map((product, index) => {
                                    const currentStatus = STATUS_LIST.find(value => value.state === product.status)

                                    return (
                                        <tr key={index}>
                                            <td>{product.article}</td>
                                            <td>{product.title}</td>
                                            <td>{product.count}</td>
                                            <td style={{backgroundColor: currentStatus?.color}}>{currentStatus?.text}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )
            )
        } else {
            closeInvoice(invoiceId)
        }
    }

    return (
        <main className={styles.main}>
            <div className={`${styles.list} ${invoiceId ? styles.activeInvoice : ""}`}>
                <h1>Накладні</h1>
                <InvoicesList/>
                {userIsConsultant(user) && <NewInvoiceBtn className={styles.addButton}/>}
            </div>
            {invoiceId && (
                <div className={styles.form}>
                    {invoice && <InvoiceForm invoice={invoice}/>}
                    {(!invoice?.paidAt && userIsCashbox(user)) && (
                        <button
                            className={styles.closeInvoiceBtn}
                            onClick={payInvoiceHandler}
                            id={"payInvoiceBtn"}
                        >
                            Сплатити список
                        </button>
                    )}
                    {(invoice?.paidAt && !invoice?.closedAt && (userIsCashbox(user) || userIsConsultant(user))) && (
                        <button
                            className={styles.closeInvoiceBtn}
                            onClick={closeInvoiceHandler}
                            id={"closeInvoiceBtn"}
                        >
                            Закрити список
                        </button>
                    )}
                </div>
            )}
            {ConfirmDialogComponent}
        </main>
    )
}