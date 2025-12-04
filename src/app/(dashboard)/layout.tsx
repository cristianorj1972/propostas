import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Users, FileText, LogOut, PlusCircle } from 'lucide-react'
import { signout } from '@/app/(auth)/login/actions'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch profile to get role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role, name')
        .eq('id', user.id)
        .single()

    const isAdmin = profile?.role === 'admin'

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-indigo-600">Propostas</h1>
                    <p className="text-sm text-gray-500 mt-1">Olá, {profile?.name || 'Usuário'}</p>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    <Link
                        href="/"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors"
                    >
                        <LayoutDashboard className="w-5 h-5 mr-3" />
                        Dashboard
                    </Link>

                    {!isAdmin && (
                        <Link
                            href="/proposals/create"
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors"
                        >
                            <PlusCircle className="w-5 h-5 mr-3" />
                            Nova Proposta
                        </Link>
                    )}

                    {isAdmin && (
                        <Link
                            href="/users"
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors"
                        >
                            <Users className="w-5 h-5 mr-3" />
                            Usuários
                        </Link>
                    )}
                </nav>
                <div className="p-4 border-t border-gray-200">
                    <form action={signout}>
                        <button className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors">
                            <LogOut className="w-5 h-5 mr-3" />
                            Sair
                        </button>
                    </form>
                </div>
            </aside>

            {/* Mobile Header & Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-indigo-600">Propostas</h1>
                    <form action={signout}>
                        <button className="p-2 text-gray-600">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </form>
                </header>
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
