'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createUser(prevState: any, formData: FormData) {
    const supabase = await createClient()

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        return { error: 'Unauthorized' }
    }

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string
    const role = formData.get('role') as string

    // Create user using a fresh client to avoid session conflict
    const { createServerClient } = await import('@supabase/ssr')

    const tempSupabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return [] },
                setAll() { }
            }
        }
    )

    const { data, error } = await tempSupabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name,
            }
        }
    })

    if (error) {
        return { error: error.message }
    }

    if (data.user) {
        // Update role
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ role })
            .eq('id', data.user.id)

        if (updateError) {
            console.error('Error updating role:', updateError)
            return { error: 'User created but failed to set role' }
        }
    }

    revalidatePath('/users')
    return { error: '' } // Success
}
