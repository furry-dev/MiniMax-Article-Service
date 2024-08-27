import Invoice from "@/components/screens/Invoice/Invoice"
import {notFound} from "next/navigation"

export default async function InvoicePage({params}: { params: { id: string } }) {
    try {
        // const manga = params.id === "new" ? {
        //     _id: params.id,
        //     articles: []
        // } : await getInvoice(params.id)

        return <Invoice invoiceId={1}/>
    } catch (e) {
        return notFound()
    }
}
