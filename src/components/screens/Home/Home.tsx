import React from "react"

import styles from "./Home.module.sass"
import InvoicesList from "@/components/lists/InvoicesList/InvoicesList"
import NewInvoiceBtn from "@/components/lists/InvoicesList/NewInvoiceBtn/NewInvoiceBtn"

function Home() {
    return (
        <main>
            <NewInvoiceBtn className={styles.addBtn}/>
            <InvoicesList type={"Opened"}/>
        </main>
    )
}

export default Home