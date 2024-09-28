import {db} from "@/db/firebase.config"
import {
    child,
    get,
    limitToFirst,
    off,
    onValue,
    orderByChild,
    push,
    query,
    ref,
    startAfter,
    update
} from "@firebase/database"
import {InvoiceEntity, InvoiceWithId, ProductEntity} from "@/utils/InvoiceManager/Invoice.interfaces"

export class InvoiceManager {
    static async getInvoices() {
        try {
            const snapshot = await get(child(ref(db), "invoices"))
            if (snapshot.exists()) {
                const invoicesData = snapshot.val()
                const invoices: InvoiceWithId[] = Object.keys(invoicesData).map(id => ({
                    id,
                    ...invoicesData[id]
                }))

                // Возвращаем только инвойсы, которые не закрыты (нет closedAt)
                return invoices.filter(invoice => !invoice.closedAt)
            } else {
                return []
            }
        } catch (error) {
            console.error("Error getting invoices:", error)
            return []
        }
    }

    static async getInvoiceById(id: string) {
        try {
            const snapshot = await get(child(ref(db), `invoices/${id}`))
            if (snapshot.exists()) {
                const invoiceData = snapshot.val() as InvoiceEntity
                const invoiceWithId: InvoiceWithId = {
                    id,
                    ...invoiceData
                }
                return invoiceWithId
            } else {
                console.warn(`Invoice with id ${id} not found`)
                return null
            }
        } catch (error) {
            console.error(`Error getting invoice with id ${id}:`, error)
            return null
        }
    }

    static async getArchive(limit: number = 20, startAfterKey?: number) {
        try {
            let queryRef
            if (startAfterKey) {
                queryRef = query(
                    ref(db, "invoices"),
                    orderByChild("closedAt"),
                    startAfter(startAfterKey),
                    limitToFirst(limit)
                )
            } else {
                queryRef = query(
                    ref(db, "invoices"),
                    orderByChild("closedAt"),
                    limitToFirst(limit)
                )
            }

            const snapshot = await get(queryRef)

            if (snapshot.exists()) {
                const invoicesData = snapshot.val()
                const invoices: InvoiceWithId[] = Object.keys(invoicesData).map(id => ({
                    id,
                    ...invoicesData[id]
                }))
                return invoices.filter(invoice => invoice.closedAt)
            } else {
                return []
            }
        } catch (error) {
            console.error("Error getting archive invoices:", error)
            return []
        }
    }

    static async createInvoice(uid: string) {
        try {
            const invoicesSnapshot = await get(child(ref(db), "invoices"))
            let invoices: InvoiceEntity[] = []

            if (invoicesSnapshot.exists()) {
                invoices = Object.values(invoicesSnapshot.val()) as InvoiceEntity[]
            }

            const usedNames = invoices
                .filter(invoice => !invoice.closedAt)
                .map(invoice => parseInt(invoice.name, 10))
                .filter(name => !isNaN(name))

            let newName = 1
            while (usedNames.includes(newName)) {
                newName++
            }

            const newInvoice: InvoiceEntity = {
                name: newName.toString().padStart(3, "0"),
                products: [],
                createdAt: new Date().getTime(),
                createBy: uid
            }

            const invoiceRef = await push(ref(db, "invoices"), newInvoice)

            return invoiceRef.key
        } catch (error) {
            console.error("Error creating invoice:", error)
            return null
        }
    }

    static async updateInvoiceProducts(invoiceId: string, updatedProducts: ProductEntity[]) {
        try {
            const invoiceRef = ref(db, `invoices/${invoiceId}`)
            await update(invoiceRef, {products: updatedProducts})
        } catch (error) {
            console.error("Error updating products:", error)
            throw error
        }
    }

    static async payInvoice(invoiceId: string) {
        try {
            const invoiceRef = ref(db, `invoices/${invoiceId}`)
            await update(invoiceRef, {paidAt: new Date().getTime()})
            console.log("Invoice paid successfully")
        } catch (error) {
            console.error("Error paid invoice:", error)
        }
    }

    static async closeInvoice(invoiceId: string) {
        try {
            const invoiceRef = ref(db, `invoices/${invoiceId}`)
            await update(invoiceRef, {closedAt: new Date().getTime()})
            console.log("Invoice closed successfully")
        } catch (error) {
            console.error("Error closed invoice:", error)
        }
    }

    static subscribeToInvoices(callback: (invoices: InvoiceWithId[]) => void) {
        const invoicesRef = ref(db, "invoices")

        const unsubscribe = onValue(invoicesRef, (snapshot) => {
            if (snapshot.exists()) {
                const invoicesData = snapshot.val()
                const invoicesList: InvoiceWithId[] = Object.keys(invoicesData).map(id => ({
                    id,
                    ...invoicesData[id]
                }))

                callback(invoicesList.filter(invoice => !invoice.closedAt))
            } else {
                callback([])
            }
        })

        return () => {
            off(invoicesRef, "value", unsubscribe)
        }
    }

    static subscribeToInvoiceById(id: string, callback: (invoice: InvoiceWithId | null) => void) {
        const invoiceRef = ref(db, `invoices/${id}`)

        const unsubscribe = onValue(invoiceRef, (snapshot) => {
            if (snapshot.exists()) {
                const invoiceData = snapshot.val() as InvoiceEntity
                const invoiceWithId: InvoiceWithId = {
                    id,
                    ...invoiceData
                }
                callback(invoiceWithId)
            } else {
                console.warn(`Invoice with id ${id} not found`)
                callback(null)
            }
        })

        return () => {
            off(invoiceRef, "value", unsubscribe)
        }
    }
}
