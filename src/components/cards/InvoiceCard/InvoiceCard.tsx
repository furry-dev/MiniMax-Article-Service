import {InvoiceWithId} from "@/utils/InvoiceManager/Invoice.interfaces"

import styles from "./InvoiceCard.module.sass"
import Link from "next/link"

export default function InvoiceCard({invoice}: { invoice: InvoiceWithId }) {
    return (
        <Link href={`/${invoice.closedAt ? "archive" : "invoice"}/${invoice.id}`} className={styles.card}>
            <small>id: {invoice.id}</small>
            <h2>{invoice.name}</h2>
            <small className={styles.created}>Created at: {new Date(invoice.createdAt).toLocaleString()}</small>
            {invoice.closedAt &&
                <small className={styles.closed}>Closed at: {new Date(invoice.closedAt).toLocaleString()}</small>}
            <ul className={styles.list}>
                {invoice.products?.slice(0, 4).map((product) => (
                    <li key={product.article}>{product.article} | {product.title}</li>
                ))}
                {!invoice.products && <span>Заявка пуста</span>}
            </ul>
            {(invoice.products?.length && invoice.products?.length > 4) && <span className={styles.doted}>...</span>}
        </Link>
    )
}