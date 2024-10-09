import {ProductEntity, WarehouseType} from "@/utils/InvoiceManager/Invoice.interfaces"
import React, {SetStateAction} from "react"
import {useActiveProduct} from "@/context/ActiveArticleProductContext"

export const WarehouseDict: { warehouse: WarehouseType, name: string, color: string }[] = [
    {warehouse: "warehouse", name: "Улица", color: "#1e90ff"},
    {warehouse: "shop", name: "Магазин", color: "#ff69b4"}
]

interface SelectWarehouseProps {
    setProducts: React.Dispatch<SetStateAction<ProductEntity[]>>
}

export default function SelectWarehouse({setProducts}: SelectWarehouseProps) {
    const {activeProduct, setActiveProduct} = useActiveProduct()

    const changeWarehouseHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const target = e.target

        if (!(target instanceof HTMLSelectElement) || !activeProduct) return false

        const warehouse = target.value as WarehouseType

        setProducts(prevProducts =>
            prevProducts.map((product, i) =>
                i === activeProduct.index ? {...product, warehouse} : product
            )
        )

        setActiveProduct(prevProduct => {
            return prevProduct ? {...prevProduct, warehouse} : undefined
        })
    }

    return (
        <select
            name="warehouse"
            value={activeProduct?.warehouse}
            style={{color: WarehouseDict.find(item => item.warehouse === activeProduct?.warehouse)?.color}}
            onChange={changeWarehouseHandler}
        >
            {WarehouseDict.map((option, index) => (
                <option
                    value={option.warehouse}
                    key={index}
                    style={{color: option.color}}
                >
                    {option.name}
                </option>
            ))}
        </select>
    )
}