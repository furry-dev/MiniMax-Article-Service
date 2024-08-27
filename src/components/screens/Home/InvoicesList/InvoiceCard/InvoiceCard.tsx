import {InvoiceEntity} from "@/utils/InvoiceManager/Invoice.interfaces"

import styles from "./InvoiceCard.module.sass"
import Link from "next/link"

export default function InvoiceCard({invoice}: { invoice: InvoiceEntity }) {
    return (
        <Link href={`/invoice/${invoice.id}`} className={styles.card}>
            <small>id: {invoice.id}</small>
            <h2>{invoice.name}</h2>
            <ul className={styles.list}>
                {invoice.products.slice(0, 9).map((product) => (
                    <li key={product.article}>{product.article} | {product.title}</li>
                ))}
            </ul>
        </Link>
    )
}