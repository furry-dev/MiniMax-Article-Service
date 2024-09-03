import Invoice from "@/components/screens/Invoice/Invoice"

export default async function InvoicePage({params}: { params?: { id: string } }) {
    return <Invoice invoiceId={params?.id}/>
}
