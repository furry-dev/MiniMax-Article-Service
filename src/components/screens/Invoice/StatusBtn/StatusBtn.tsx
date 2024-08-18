"use client"

import React, {useState} from "react"

import styles from "./StatusBtn.module.sass"

const STATUS_LIST = [
    {text: "Збирається", color: "red"},
    {text: "Зібрано", color: "orange"},
    {text: "Видано", color: "green"}
]


export default function StatusBtn() {
    const [status, setStatus] = useState(0)

    const onButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setStatus(prevState => (prevState + 1) % STATUS_LIST.length)
    }

    return (
        <button
            className={styles.button}
            type={"button"}
            onClick={onButtonClick}
            style={{background: STATUS_LIST[status].color}}
        >
            {STATUS_LIST[status]?.text}
        </button>
    )
}