import {db} from "@/db/firebase.config"
import {child, get, off, onValue, push, ref, update} from "@firebase/database"
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

    static async getArchive() {
        try {
            const snapshot = await get(child(ref(db), "invoices"))
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

    static async createInvoice() {
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
                createdAt: new Date().toISOString(),
            }

            const invoiceRef = await push(ref(db, "invoices"), newInvoice)

            return invoiceRef.key
        } catch (error) {
            console.error("Error creating invoice:", error)
            return null
        }
    }

    static updateInvoiceProducts(invoiceId: string, updatedProducts: ProductEntity[]) {
        const invoiceRef = ref(db, `invoices/${invoiceId}`)
        update(invoiceRef, {products: updatedProducts})
            .then(() => {
                console.log("Products updated successfully")
            })
            .catch((error) => {
                console.error("Error updating products:", error)
            })
    }

    static async closeInvoice(invoiceId: string) {
        try {
            const invoiceRef = ref(db, `invoices/${invoiceId}`)
            await update(invoiceRef, {closedAt: new Date().toISOString()})
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

                // Фильтруем инвойсы по закрытому статусу
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
