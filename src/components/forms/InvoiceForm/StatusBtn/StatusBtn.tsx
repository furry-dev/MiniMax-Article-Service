"use client"

import React from "react"

import styles from "./StatusBtn.module.sass"
import {ProductStatus} from "@/utils/InvoiceManager/Invoice.interfaces"

const STATUS_LIST: { state: ProductStatus, text: string, color: string }[] = [
    {state: "Assembly", text: "Збирається", color: "red"},
    {state: "Assembled", text: "Зібрано", color: "orange"},
    {state: "Delivered", text: "Видано", color: "green"}
]


export default function StatusBtn({status, setStatus, name}: {
    status: ProductStatus,
    setStatus: (status: ProductStatus) => void,
    name?: string
}) {
    const currentIndex = STATUS_LIST.findIndex(value => value.state === status)

    const onButtonClick = () => {
        setStatus(STATUS_LIST[(currentIndex + 1) % STATUS_LIST.length].state)
    }

    return (
        <button
            name={name}
            className={styles.button}
            type={"button"}
            onClick={onButtonClick}
            style={{background: STATUS_LIST[currentIndex].color}}
        >
            {STATUS_LIST[currentIndex]?.text}
        </button>
    )
}