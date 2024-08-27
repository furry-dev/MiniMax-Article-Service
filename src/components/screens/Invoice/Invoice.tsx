import InvoicesList from "@/components/screens/Home/InvoicesList/InvoicesList"
import InvoiceForm from "@/components/screens/Invoice/InvoiceForm/InvoiceForm"
import {InvoiceEntity} from "@/utils/InvoiceManager/Invoice.interfaces"

import styles from "./Invoice.module.sass"

export default function Invoice({invoiceId}: { invoiceId: number }) {
    const invoice: InvoiceEntity = {
        id: 4,
        locked: false,
        name: "004",
        products: [
            {
                article: 1007,
                title: "Плитка",
                count: 10,
                status: "Assembled"
            },
            {
                article: 1008,
                title: "Краска",
                count: 3,
                status: "Delivered"
            },
            {
                article: 1009,
                title: "Шпатлёвка",
                count: 1,
                status: "Assembly"
            },
            {
                article: 1010,
                title: "Цемент",
                count: 4,
                status: "Assembled"
            }
        ]
    }

    return (
        <main className={styles.main}>
            <div className={styles.list}>
                <InvoicesList/>
            </div>
            <div className={styles.form}>
                <InvoiceForm invoice={invoice}/>
            </div>
        </main>
    )
}