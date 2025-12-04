'use client'

import { useActionState } from 'react'
import { respondToProposal } from './actions'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

const initialState = {
    error: '',
    success: false,
}

export default function ResponseButtons({ token }: { token: string }) {
    const acceptAction = respondToProposal.bind(null, token, 'accepted')
    const rejectAction = respondToProposal.bind(null, token, 'rejected')

    const [acceptState, formActionAccept, isPendingAccept] = useActionState(acceptAction, initialState)
    const [rejectState, formActionReject, isPendingReject] = useActionState(rejectAction, initialState)

    if (acceptState?.success || rejectState?.success) {
        if (typeof window !== 'undefined') {
            window.location.reload()
        }
        return <div className="text-center text-black">Atualizando...</div>
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <form action={formActionAccept}>
                <button
                    disabled={isPendingAccept || isPendingReject}
                    className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-green-600 hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-green-200 disabled:opacity-50"
                >
                    {isPendingAccept ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle className="w-6 h-6 mr-2" />}
                    {isPendingAccept ? 'Aceitando...' : 'Aceitar Proposta'}
                </button>
                {acceptState?.error && <p className="text-red-500 text-sm mt-2">{acceptState.error}</p>}
            </form>

            <form action={formActionReject}>
                <button
                    disabled={isPendingAccept || isPendingReject}
                    className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-red-600 hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-red-200 disabled:opacity-50"
                >
                    {isPendingReject ? <Loader2 className="w-6 h-6 animate-spin" /> : <XCircle className="w-6 h-6 mr-2" />}
                    {isPendingReject ? 'Rejeitando...' : 'Rejeitar Proposta'}
                </button>
                {rejectState?.error && <p className="text-red-500 text-sm mt-2">{rejectState.error}</p>}
            </form>
        </div>
    )
}
