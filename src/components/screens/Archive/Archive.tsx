import React from "react"
import InvoicesList from "@/components/lists/InvoicesList/InvoicesList"
import styles from "./Archive.module.sass"

function Archive() {
    return (
        <main className={styles.main}>
            <h1>Архів</h1>
            <InvoicesList type={"Archive"}/>
        </main>
    )
}

export default Archive