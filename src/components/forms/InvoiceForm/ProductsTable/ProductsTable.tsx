import styles from "./ProductsTable.module.sass"
import React, {SetStateAction, useEffect, useRef, useState} from "react"
import {InvoiceWithId, ProductEntity} from "@/utils/InvoiceManager/Invoice.interfaces"
import Product from "@/components/forms/InvoiceForm/ProductsTable/Product/Product"
import {useUser} from "@/context/UserContext"
import {userIsConsultant} from "@/utils/userRoles"

interface ProductsTableProps {
    invoice: InvoiceWithId
    products: ProductEntity[]
    setProducts: React.Dispatch<SetStateAction<ProductEntity[]>>
    invalidFields: number[]
}

export default function ProductsTable({
    invoice,
    products,
    setProducts,
    invalidFields
}: ProductsTableProps) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    useEffect(() => {
        const windowResize = () => {
            setWindowWidth(window.innerWidth)
        }

        window.addEventListener("resize", windowResize)
        windowResize()

        return () => {
            window.removeEventListener("resize", windowResize)
        }
    }, [])

    const containerRef = useRef<HTMLTableElement | null>(null)

    const user = useUser()

    return (
        <table className={styles.namesTable} ref={containerRef}>
            <colgroup>
                <col style={{width: "90px"}}/>
                <col
                    style={{width: `calc(${windowWidth > 880 ? "min(calc(100vw - 480px), 500px, 100vw)" : "100vw"} - 250px)`}}/>
                <col style={{width: "60px"}}/>
                <col style={{width: "100px"}}/>
            </colgroup>

            <thead className={styles.header}>
                <tr>
                    <th>Артикул</th>
                    <th>Назва</th>
                    <th>к-сть</th>
                    <th>Статус</th>
                </tr>
            </thead>
            <tbody>
                {products.map((item, index) => (
                    <Product
                        key={index}
                        item={item}
                        index={index}
                        closed={Boolean(invoice.closedAt) || !userIsConsultant(user)}
                        paid={Boolean(invoice.paidAt) || !userIsConsultant(user)}
                        containerRef={containerRef}
                        setProducts={setProducts}
                        invalid={invalidFields.includes(index)}
                    />
                ))}
            </tbody>
        </table>
    )
}