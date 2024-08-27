import React from "react"
import Link from "next/link"

import styles from "./Home.module.sass"
import InvoicesList from "@/components/screens/Home/InvoicesList/InvoicesList"

function Home() {
    return (
        <main>
            <Link href={"/invoice/new"} className={styles.addButton}>+</Link>
            <InvoicesList/>
        </main>
    )
}

export default Home