import Invoice from "@/components/screens/Invoice/Invoice"

export default function InvoicePage({params}: { params?: { id: string } }) {
    return <Invoice invoiceId={params?.id}/>
}
