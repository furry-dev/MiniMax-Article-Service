import {InvoiceEntity} from "@/utils/InvoiceManager/Invoice.interfaces"
import InvoiceCard from "@/components/screens/Home/InvoicesList/InvoiceCard/InvoiceCard"
import styles from "./InvoicesList.module.sass"

const INVOICES: InvoiceEntity[] = [
    {
        id: 1,
        locked: false,
        name: "001",
        products: [
            {
                article: 1001,
                title: "Шурупы",
                count: 15,
                status: "Assembly"
            },
            {
                article: 1002,
                title: "Молоток",
                count: 1,
                status: "Assembled"
            }
        ]
    },
    {
        id: 2,
        locked: false,
        name: "002",
        products: [
            {
                article: 1003,
                title: "Отвёртка",
                count: 7,
                status: "Delivered"
            },
            {
                article: 1004,
                title: "Гвозди",
                count: 20,
                status: "Assembly"
            },
            {
                article: 1005,
                title: "Пила",
                count: 2,
                status: "Assembled"
            }
        ]
    },
    {
        id: 3,
        locked: false,
        name: "003",
        products: [
            {
                article: 1006,
                title: "Клей",
                count: 5,
                status: "Assembly"
            }
        ]
    },
    {
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
    },
    {
        id: 5,
        locked: false,
        name: "005",
        products: [
            {
                article: 1011,
                title: "Уголок металлический",
                count: 8,
                status: "Delivered"
            },
            {
                article: 1012,
                title: "Изоляция",
                count: 3,
                status: "Assembled"
            },
            {
                article: 1013,
                title: "Кирпич",
                count: 12,
                status: "Assembly"
            }
        ]
    }
]

export default function InvoicesList() {
    return (
        <ul className={styles.list}>
            {INVOICES.map((invoice) => (
                <li key={invoice.id}>
                    <InvoiceCard invoice={invoice}/>
                </li>
            ))}
        </ul>
    )
}