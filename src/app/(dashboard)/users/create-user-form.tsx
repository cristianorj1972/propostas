'use client'

import { useActionState } from 'react'
import { createUser } from './actions'

const initialState = {
    error: '',
}

export default function CreateUserForm() {
    const [state, formAction, isPending] = useActionState(createUser, initialState)

    return (
        <form action={formAction} className="space-y-4">
            {state?.error && (
                <div className="text-red-600 text-sm">{state.error}</div>
            )}
            <div>
                <label className="block text-sm font-medium text-black">Nome Completo</label>
                <input
                    name="name"
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black bg-white"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-black">Email</label>
                <input
                    name="email"
                    type="email"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black bg-white"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-black">Senha</label>
                <input
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black bg-white"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-black">Função</label>
                <select
                    name="role"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black bg-white"
                >
                    <option value="user">Usuário</option>
                    <option value="admin">Administrador</option>
                </select>
            </div>
            <button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
                {isPending ? 'Criando...' : 'Criar Usuário'}
            </button>
        </form>
    )
}
