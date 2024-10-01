import {InvoiceWithId} from "@/utils/InvoiceManager/Invoice.interfaces"
import {off, onValue, ref} from "@firebase/database"
import {db} from "@/db/firebase.config"

export class RevaluationManager {
    static subscribeToRevaluations(callback: (invoices: InvoiceWithId[]) => void) {
        const invoicesRef = ref(db, "revaluations")

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
}