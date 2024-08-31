import React from "react"

import styles from "./Home.module.sass"
import InvoicesList from "@/components/screens/Home/InvoicesList/InvoicesList"
import NewInvoiceBtn from "@/components/screens/Home/InvoicesList/NewInvoiceBtn/NewInvoiceBtn"

function Home() {
    return (
        <main>
            <NewInvoiceBtn className={styles.addBtn}/>
            <InvoicesList/>
        </main>
    )
}

export default Home