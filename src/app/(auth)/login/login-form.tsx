'use client'

import { useActionState } from 'react'
import { login } from './actions'

const initialState = {
    error: '',
}

export default function LoginForm() {
    const [state, formAction, isPending] = useActionState(login, initialState)

    return (
        <form className="mt-8 space-y-6" action={formAction}>
            {state?.error && (
                <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">{state.error}</h3>
                        </div>
                    </div>
                </div>
            )}
            <div className="rounded-md shadow-sm -space-y-px">
                <div>
                    <label htmlFor="email-address" className="sr-only">
                        Endereço de Email
                    </label>
                    <input
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-white"
                        placeholder="Endereço de Email"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="sr-only">
                        Senha
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-white"
                        placeholder="Senha"
                    />
                </div>
            </div>

            <div>
                <button
                    disabled={isPending}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50"
                >
                    {isPending ? 'Entrando...' : 'Entrar'}
                </button>
            </div>
        </form>
    )
}
