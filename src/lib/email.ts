import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
})

export async function sendProposalEmail({
    to,
    clientName,
    readLink,
    responseLink,
}: {
    to: string
    clientName: string
    readLink: string
    responseLink: string
}) {
    if (!process.env.SMTP_USER) {
        console.log('⚠️ SMTP_USER não configurado. Logando email:')
        console.log(`Para: ${to}`)
        console.log(`Assunto: Nova Proposta para ${clientName}`)
        console.log(`Ler: ${readLink}`)
        console.log(`Responder: ${responseLink}`)
        return
    }

    await transporter.sendMail({
        from: process.env.SMTP_FROM || '"App de Propostas" <noreply@example.com>',
        to,
        subject: `Nova Proposta para ${clientName}`,
        html: `
      <h1>Olá ${clientName},</h1>
      <p>Você recebeu uma nova proposta de serviço.</p>
      <p>Você pode visualizar os detalhes da proposta aqui: <a href="${readLink}">Ver Proposta</a></p>
      <p>Por favor, aceite ou rejeite a proposta aqui: <a href="${responseLink}">Responder à Proposta</a></p>
      <br/>
      <p>Obrigado!</p>
    `,
    })
}
