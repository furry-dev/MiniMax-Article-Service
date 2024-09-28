import React, {SetStateAction} from "react"

import styles from "./StatusBtn.module.sass"
import {ProductEntity, ProductStatus} from "@/utils/InvoiceManager/Invoice.interfaces"

interface StatusBtnProps {
    index: number
    closed?: boolean
    product: ProductEntity
    setProducts: React.Dispatch<SetStateAction<ProductEntity[]>>
    name?: string
}

export const STATUS_LIST: { state: ProductStatus, text: string, color: string }[] = [
    {state: "Assembly", text: "Збирається", color: "red"},
    {state: "Assembled", text: "Зібрано", color: "orange"},
    {state: "Delivered", text: "Видано", color: "green"}
]


export default function StatusBtn(
    {
        index,
        closed,
        product,
        setProducts,
        name
    }: StatusBtnProps
) {
    const currentIndex = STATUS_LIST.findIndex(value => value.state === product.status)

    const onBtnClick = () => {
        if (closed) return

        const status: ProductStatus = STATUS_LIST[(currentIndex + 1) % STATUS_LIST.length].state

        setProducts(prevProducts =>
            prevProducts.map((product, i) =>
                i === index ? {...product, status} : product
            )
        )

    }


    return (
        <button
            name={name}
            className={styles.button}
            type={"button"}
            onClick={onBtnClick}
            style={{background: STATUS_LIST[currentIndex].color}}
        >
            {STATUS_LIST[currentIndex]?.text}
        </button>
    )
}
