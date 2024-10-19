import {useActiveProduct} from "@/context/ActiveArticleProductContext"

import styles from "./ProductView.module.sass"
import SelectWarehouse from "@/components/forms/InvoiceForm/ProductView/SelectWarehouse/SelectWarehouse"
import React, {SetStateAction} from "react"
import {ProductEntity} from "@/utils/InvoiceManager/Invoice.interfaces"

export default function ProductView({setProducts}: { setProducts: React.Dispatch<SetStateAction<ProductEntity[]>> }) {
    const {activeProduct} = useActiveProduct()

    return (
        <>
            {activeProduct && (
                <>
                    <div className={styles.view}>
                        <textarea
                            cols={25}
                            rows={3}
                            value={activeProduct?.title}
                            disabled={true}
                        ></textarea>
                        <label>
                            Склад:
                            <SelectWarehouse setProducts={setProducts}/>
                        </label>
                    </div>
                </>
            )}
        </>
    )
}