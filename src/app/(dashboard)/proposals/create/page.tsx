'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { generateProposalPDF } from '@/lib/pdf-generator'
import { createProposalAction } from './actions'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function CreateProposalPage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const data = {
            clientName: formData.get('client_name') as string,
            clientPhone: formData.get('client_phone') as string,
            clientEmail: formData.get('client_email') as string,
            value: formData.get('value') as string,
            description: formData.get('description') as string,
        }

        try {
            // 1. Generate PDF
            const pdfBlob = await generateProposalPDF(data)
            const pdfFile = new File([pdfBlob], `proposta-${Date.now()}.pdf`, { type: 'application/pdf' })

            // 2. Upload to Supabase Storage
            const supabase = createClient()
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('proposals')
                .upload(`${Date.now()}-${data.clientName.replace(/\s+/g, '-').toLowerCase()}.pdf`, pdfFile)

            if (uploadError) throw new Error('Falha ao enviar PDF: ' + uploadError.message)

            const { data: { publicUrl } } = supabase.storage
                .from('proposals')
                .getPublicUrl(uploadData.path)

            // 3. Create Record & Send Email via Server Action
            const result = await createProposalAction(formData, publicUrl)

            if (result?.error) {
                throw new Error(result.error)
            }

            router.push('/')
        } catch (error: any) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-black mb-6">Criar Nova Proposta</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-black">Nome do Cliente</label>
                        <input
                            name="client_name"
                            type="text"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black bg-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-black">Telefone do Cliente</label>
                        <input
                            name="client_phone"
                            type="tel"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black bg-white"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-black">E-mail do Cliente</label>
                    <input
                        name="client_email"
                        type="email"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black bg-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-black">Valor (R$)</label>
                    <input
                        name="value"
                        type="number"
                        step="0.01"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black bg-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-black">Descrição</label>
                    <textarea
                        name="description"
                        rows={4}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black bg-white"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {loading ? 'Processando...' : 'Criar Proposta'}
                    </button>
                </div>
            </form>
        </div>
    )
}
