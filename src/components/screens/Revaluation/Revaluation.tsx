"use client"

import styles from "./Revaluation.module.sass"

export default function Revaluation({revaluationId}: { revaluationId?: string }) {
    return (
        <main className={styles.main}>
            <div className={`${styles.list} ${revaluationId ? styles.activeInvoice : ""}`}>
                <h1>Переоцінка</h1>
            </div>
        </main>
    )
}