import Invoice, {InvoiceEntity} from "@/components/screens/Invoice/Invoice"
import {notFound} from "next/navigation"

export default async function InvoicePage({params}: { params: { id: string } }) {
    try {
        // const manga = params.id === "new" ? {
        //     _id: params.id,
        //     articles: []
        // } : await getInvoice(params.id)

        const invoice: InvoiceEntity = {
            _id: params.id,
            articles: [
                {id: "", status: 0}
            ]
        }

        console.log(invoice)

        return <Invoice invoice={invoice}/>
    } catch (e) {
        return notFound()
    }
}
