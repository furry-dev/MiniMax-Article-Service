"use client"

import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useState} from "react"
import {ProductEntity} from "@/utils/InvoiceManager/Invoice.interfaces"

export interface ActiveArticleProductContextEntity extends ProductEntity {
    index: number
}

interface ActiveArticleProductContextType {
    activeProduct: ActiveArticleProductContextEntity | undefined
    setActiveProduct: Dispatch<SetStateAction<ActiveArticleProductContextEntity | undefined>>
}

const ActiveArticleProductContext = createContext<ActiveArticleProductContextType | undefined>(undefined)

export const useActiveProduct = (): ActiveArticleProductContextType => {
    const context = useContext(ActiveArticleProductContext)
    if (!context) {
        throw new Error("useActiveProduct must be used within ActiveArticleProductProvider")
    }
    return context
}

interface ActiveArticleProductProviderProps {
    children?: ReactNode;
}

export const ActiveArticleProductProvider = ({children}: ActiveArticleProductProviderProps) => {
    const [activeProduct, setActiveProduct] = useState<ActiveArticleProductContextEntity | undefined>(undefined)

    return (
        <ActiveArticleProductContext.Provider value={{activeProduct, setActiveProduct}}>
            {children}
        </ActiveArticleProductContext.Provider>
    )
}
