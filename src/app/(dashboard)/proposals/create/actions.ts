'use server'

import { createClient } from '@/lib/supabase/server'
import { sendProposalEmail } from '@/lib/email'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProposalAction(formData: FormData, pdfUrl: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const clientName = formData.get('client_name') as string
    const clientEmail = formData.get('client_email') as string
    const clientPhone = formData.get('client_phone') as string
    const value = formData.get('value') as string
    const description = formData.get('description') as string

    // Insert into DB
    const { data: proposal, error } = await supabase
        .from('proposals')
        .insert({
            user_id: user.id,
            client_name: clientName,
            client_email: clientEmail,
            client_phone: clientPhone,
            value: parseFloat(value),
            description,
            pdf_url: pdfUrl,
            status: 'sent',
        })
        .select()
        .single()

    if (error) {
        return { error: error.message }
    }

    // Send Email
    const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const readLink = `${origin}/p/${proposal.read_token}`
    const responseLink = `${origin}/r/${proposal.response_token}`

    await sendProposalEmail({
        to: clientEmail,
        clientName,
        readLink,
        responseLink,
    })

    revalidatePath('/')
    return { success: true }
}
