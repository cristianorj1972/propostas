import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { UserPlus } from 'lucide-react'
import CreateUserForm from './create-user-form'

export default async function UsersPage() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // Check admin role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        redirect('/')
    }

    const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-black">Gerenciamento de Usuários</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Create User Form */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-black mb-4 flex items-center">
                        <UserPlus className="w-5 h-5 mr-2" />
                        Adicionar Novo Usuário
                    </h3>
                    <CreateUserForm />
                </div>

                {/* Users List */}
                <div className="lg:col-span-2 bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-black">Todos os Usuários</h3>
                    </div>
                    <ul className="divide-y divide-gray-200">
                        {users?.map((u) => (
                            <li key={u.id} className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                            {u.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-black">{u.name}</div>
                                            <div className="text-sm text-gray-500">{u.email}</div>
                                        </div>
                                    </div>
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {u.role === 'admin' ? 'Administrador' : 'Usuário'}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
