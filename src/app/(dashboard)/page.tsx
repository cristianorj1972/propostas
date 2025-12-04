import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, FileText, CheckCircle, XCircle, Clock } from 'lucide-react'

export default async function DashboardPage() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    const isAdmin = profile?.role === 'admin'

    // Fetch stats
    let query = supabase.from('proposals').select('status', { count: 'exact' })
    if (!isAdmin) {
        query = query.eq('user_id', user.id)
    }

    let proposalsQuery = supabase
        .from('proposals')
        .select('*')
        .order('created_at', { ascending: false })

    if (!isAdmin) {
        proposalsQuery = proposalsQuery.eq('user_id', user.id)
    }

    const { data: proposals } = await proposalsQuery

    const stats = {
        total: proposals?.length || 0,
        accepted: proposals?.filter((p) => p.status === 'accepted').length || 0,
        rejected: proposals?.filter((p) => p.status === 'rejected').length || 0,
        sent: proposals?.filter((p) => p.status === 'sent').length || 0,
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-black">Dashboard</h2>
                {!isAdmin && (
                    <Link
                        href="/proposals/create"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Nova Proposta
                    </Link>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total de Propostas" value={stats.total} icon={FileText} color="bg-blue-500" />
                <StatCard title="Aceitas" value={stats.accepted} icon={CheckCircle} color="bg-green-500" />
                <StatCard title="Rejeitadas" value={stats.rejected} icon={XCircle} color="bg-red-500" />
                <StatCard title="Pendentes" value={stats.sent} icon={Clock} color="bg-yellow-500" />
            </div>

            {/* Recent Proposals Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-black">Propostas Recentes</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {proposals?.map((proposal) => (
                                <tr key={proposal.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-black">{proposal.client_name}</div>
                                        <div className="text-sm text-gray-500">{proposal.client_email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        R$ {Number(proposal.value).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={proposal.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(proposal.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {proposal.pdf_url && (
                                            <a href={proposal.pdf_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900 mr-4">
                                                Ver PDF
                                            </a>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {proposals?.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                        Nenhuma proposta encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, value, icon: Icon, color }: any) {
    return (
        <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
                <div className="flex items-center">
                    <div className={`flex-shrink-0 rounded-md p-3 ${color}`}>
                        <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                            <dd>
                                <div className="text-lg font-medium text-black">{value}</div>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        sent: 'bg-yellow-100 text-yellow-800',
        accepted: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
    }
    const labels = {
        sent: 'Enviado',
        accepted: 'Aceito',
        rejected: 'Rejeitado',
    }
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status as keyof typeof styles]}`}>
            {labels[status as keyof typeof labels]}
        </span>
    )
}
