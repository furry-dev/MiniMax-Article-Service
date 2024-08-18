"use client"

import {ChangeEvent, FormEvent, KeyboardEvent, useState} from "react"

import styles from "./Invoice.module.sass"
import StatusBtn from "@/components/screens/Invoice/StatusBtn/StatusBtn"

export interface ArticleEntity {
    id: string
    status: number
}

export interface InvoiceEntity {
    _id: string
    articles: ArticleEntity[]
}


export default function Invoice({invoice}: { invoice: InvoiceEntity }) {
    const [editedNames, setEditedNames] = useState<ArticleEntity[]>(invoice.articles)

    const handleNameChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        let updatedNames = [...editedNames]
        if (!updatedNames[index]) return false
        updatedNames[index].id = e.target.value

        const emptyValues = updatedNames.filter(name => name.id.trim().length < 1)

        if (e.target.value.trim().length > 0 && emptyValues.length < 1) updatedNames.push({id: "", status: 0})
        else if (emptyValues.length > 1) updatedNames = updatedNames.filter(name => name.id.trim().length > 0 || name === updatedNames[index])

        setEditedNames(updatedNames)
    }

    const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
        if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
            const index = parseFloat(e.target.dataset.index || "0")
            const nextInput = document.querySelector(`[data-index="${index + 1}"]`)
            if (nextInput instanceof HTMLElement) {
                e.preventDefault()
                nextInput.focus()
            }
        }
    }

    const submitHandler = (e: FormEvent) => {
        e.preventDefault()
        const names = editedNames.filter(name => name.id.trim().length > 0)

        try {
            if (invoice._id === "new") {

                console.log("adding new invoice", names)

            } else {
                const _id = invoice._id

                console.log(`Edit ${_id}`)
            }
        } catch (error) {
            console.error("Ошибка!")
        }
    }

    return (
        <main>
            <form className={styles.form} onSubmit={submitHandler} onKeyDown={onKeyDown}>
                <div className={styles.tableContainer}>
                    <table className={styles.namesTable}>
                        <thead>
                            <tr>
                                <th>Артикул</th>
                                <th>Статус</th>
                            </tr>
                        </thead>
                        <tbody>
                            {editedNames.map((name, index) => (
                                <tr key={index}>
                                    <td>
                                        <input
                                            type="number"
                                            value={name.id}
                                            data-index={index}
                                            onChange={(e) => handleNameChange(index, e)}
                                        />
                                    </td>
                                    <td>
                                        <StatusBtn/>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button type={"submit"}>Сохранить</button>
            </form>
        </main>
    )
}