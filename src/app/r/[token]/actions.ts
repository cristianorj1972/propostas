'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function respondToProposal(token: string, status: 'accepted' | 'rejected', prevState: any, formData: FormData) {
    // Note: When using .bind, the bound arguments come first, then prevState, then formData.
    // Wait, useActionState passes (prevState, payload).
    // If we bind arguments, they are prepended to the action call?
    // React docs: "The new action will receive the bound arguments as its first arguments, followed by the previous state, and finally the form data."
    // So signature should be: (token, status, prevState, formData)

    const supabase = await createClient()

    const { error } = await supabase.rpc('update_proposal_status', {
        token,
        new_status: status,
    })

    if (error) {
        return { error: error.message, success: false }
    }

    revalidatePath(`/r/${token}`)
    return { success: true, error: '' }
}
