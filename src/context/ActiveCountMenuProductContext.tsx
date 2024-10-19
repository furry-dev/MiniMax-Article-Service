"use client"

import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useState} from "react"
import {ProductEntity} from "@/utils/InvoiceManager/Invoice.interfaces"

export interface ActiveCountMenuProductEntity extends ProductEntity {
    index: number
}

interface ActiveCountMenuProductType {
    activeProduct: ActiveCountMenuProductEntity | undefined
    setActiveProduct: Dispatch<SetStateAction<ActiveCountMenuProductEntity | undefined>>
}

const ActiveCountMenuProductContext = createContext<ActiveCountMenuProductType | undefined>(undefined)

export const useActiveCountMenuProduct = (): ActiveCountMenuProductType => {
    const context = useContext(ActiveCountMenuProductContext)
    if (!context) {
        throw new Error("useActiveCountMenuProduct must be used within ActiveCountMenuProductContext")
    }
    return context
}

interface ActiveArticleProductProviderProps {
    children?: ReactNode;
}

export const ActiveCountMenuProductProvider = ({children}: ActiveArticleProductProviderProps) => {
    const [activeProduct, setActiveProduct] = useState<ActiveCountMenuProductEntity | undefined>(undefined)

    return (
        <ActiveCountMenuProductContext.Provider value={{activeProduct, setActiveProduct}}>
            {children}
        </ActiveCountMenuProductContext.Provider>
    )
}
