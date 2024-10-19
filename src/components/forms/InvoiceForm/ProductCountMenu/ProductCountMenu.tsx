import styles from "@/components/forms/InvoiceForm/ProductView/ProductView.module.sass"
import WeightCalculatorForm from "@/components/forms/WeightCalculatorForm/WeightCalculatorForm"
import React, {SetStateAction} from "react"
import {useActiveCountMenuProduct} from "@/context/ActiveCountMenuProductContext"
import {ProductEntity} from "@/utils/InvoiceManager/Invoice.interfaces"

export default function ProductCountMenu({setProducts}: {
    setProducts: React.Dispatch<SetStateAction<ProductEntity[]>>
}) {
    const {activeProduct, setActiveProduct} = useActiveCountMenuProduct()

    const setProductCount = (calcCount: number) => {
        if (!activeProduct) return false

        const count = Math.round(calcCount)

        setProducts(prevProducts =>
            prevProducts.map((product, i) =>
                i === activeProduct.index ? {...product, count} : product
            )
        )

        setActiveProduct(undefined)
    }

    return (
        <>
            {activeProduct && (
                <div className={styles.weightCalculator} onClick={(e) => e.stopPropagation()}>
                    <WeightCalculatorForm
                        itemCount={activeProduct.count}
                        setProductCount={setProductCount}
                    />
                    <button className={"black-cyan"} onClick={() => setActiveProduct(undefined)}>Відміна</button>
                </div>
            )}
        </>
    )
}