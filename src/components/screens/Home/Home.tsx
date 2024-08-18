import React from "react"
import Link from "next/link"

import styles from "./Home.module.sass"

function Home() {
    return (
        <main>
            <Link href={"/invoice/new"} className={styles.addButton}>+</Link>
        </main>
    )
}

export default Home