import Archive from "@/components/screens/Archive/Archive"

export default function ArchivePage({params}: { params?: { id: string } }) {
    return <Archive invoiceId={params?.id}/>
}
