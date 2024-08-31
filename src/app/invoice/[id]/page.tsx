import Invoice from "@/components/screens/Invoice/Invoice"
import {notFound} from "next/navigation"

export default async function InvoicePage({params}: { params: { id: string } }) {
    try {
        return <Invoice invoiceId={params.id}/>
    } catch (e) {
        return notFound()
    }
}
