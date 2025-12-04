import { createClient } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { FileText, Calendar, DollarSign } from 'lucide-react'

export default async function ReadProposalPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = await params
    const supabase = await createServerClient()

    const { data: proposals, error } = await supabase.rpc('get_proposal_by_read_token', {
        token: token,
    })

    if (error || !proposals || proposals.length === 0) {
        notFound()
    }

    const proposal = proposals[0]

    const statusLabels = {
        sent: 'Enviado',
        accepted: 'Aceito',
        rejected: 'Rejeitado',
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
                <div className="bg-indigo-600 px-6 py-8 text-white">
                    <h1 className="text-3xl font-bold">Proposta para {proposal.client_name}</h1>
                    <p className="mt-2 opacity-90">Enviada em {new Date(proposal.created_at).toLocaleDateString()}</p>
                </div>

                <div className="p-8 space-y-8">
                    {/* Status Banner */}
                    <div className={`p-4 rounded-lg flex items-center justify-between ${proposal.status === 'accepted' ? 'bg-green-50 text-green-700' :
                            proposal.status === 'rejected' ? 'bg-red-50 text-red-700' :
                                'bg-yellow-50 text-yellow-700'
                        }`}>
                        <span className="font-semibold text-lg">Status: {statusLabels[proposal.status as keyof typeof statusLabels].toUpperCase()}</span>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-lg font-medium text-black mb-2">Descrição</h3>
                        <div className="prose max-w-none text-black whitespace-pre-wrap">
                            {proposal.description}
                        </div>
                    </div>

                    {/* Value */}
                    <div className="flex items-center text-2xl font-bold text-black">
                        <DollarSign className="w-6 h-6 mr-2 text-green-600" />
                        R$ {Number(proposal.value).toFixed(2)}
                    </div>

                    {/* Actions */}
                    <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row gap-4">
                        {proposal.pdf_url && (
                            <a
                                href={proposal.pdf_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                            >
                                <FileText className="w-5 h-5 mr-2" />
                                Baixar PDF
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
