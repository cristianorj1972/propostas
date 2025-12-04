import { jsPDF } from 'jspdf'

export async function generateProposalPDF(data: {
    clientName: string
    clientPhone: string
    clientEmail: string
    value: string
    description: string
}) {
    const doc = new jsPDF()

    // Header
    doc.setFontSize(22)
    doc.text('Proposta de Serviço', 105, 20, { align: 'center' })

    // Client Info
    doc.setFontSize(12)
    doc.text('Informações do Cliente:', 20, 40)
    doc.setFontSize(10)
    doc.text(`Nome: ${data.clientName}`, 20, 50)
    doc.text(`Email: ${data.clientEmail}`, 20, 55)
    doc.text(`Telefone: ${data.clientPhone}`, 20, 60)

    // Proposal Details
    doc.setFontSize(12)
    doc.text('Detalhes da Proposta:', 20, 80)
    doc.setFontSize(10)

    const splitDescription = doc.splitTextToSize(data.description, 170)
    doc.text(splitDescription, 20, 90)

    // Value
    const yPos = 90 + (splitDescription.length * 5) + 10
    doc.setFontSize(14)
    doc.text(`Valor Total: R$ ${Number(data.value).toFixed(2)}`, 20, yPos)

    // Footer
    doc.setFontSize(8)
    doc.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')}`, 20, 280)

    return doc.output('blob')
}
