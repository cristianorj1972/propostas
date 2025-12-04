import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { CheckCircle, XCircle } from 'lucide-react'
import ResponseButtons from './response-buttons'

export default async function RespondProposalPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = await params
    const supabase = await createClient()

    const { data: proposals, error } = await supabase.rpc('get_proposal_by_response_token', {
        token: token,
    })

    if (error || !proposals || proposals.length === 0) {
        notFound()
    }

    const proposal = proposals[0]

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white shadow-xl rounded-2xl overflow-hidden">
                <div className="bg-indigo-600 px-6 py-8 text-white text-center">
                    <h1 className="text-3xl font-bold">Resposta da Proposta</h1>
                    <p className="mt-2 opacity-90">Por favor, revise e responda à proposta</p>
                </div>

                <div className="p-8 space-y-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-black">{proposal.client_name}</h2>
                        <p className="text-gray-500 mt-1">Valor: R$ {Number(proposal.value).toFixed(2)}</p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="font-medium text-black mb-2">Descrição</h3>
                        <p className="text-black whitespace-pre-wrap">{proposal.description}</p>
                    </div>

                    {proposal.status === 'sent' ? (
                        <ResponseButtons token={token} />
                    ) : (
                        <div className={`text-center p-8 rounded-xl ${proposal.status === 'accepted' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                            }`}>
                            {proposal.status === 'accepted' ? (
                                <>
                                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
                                    <h3 className="text-2xl font-bold">Proposta Aceita!</h3>
                                    <p className="mt-2">Obrigado pela preferência.</p>
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-16 h-16 mx-auto mb-4 text-red-600" />
                                    <h3 className="text-2xl font-bold">Proposta Rejeitada</h3>
                                    <p className="mt-2">Agradecemos sua consideração.</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
