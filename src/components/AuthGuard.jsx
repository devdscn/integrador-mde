// src/components/AuthGuard.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Navigate } from 'react-router-dom';

function AuthGuard({ children }) {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verifica a sessão atual
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        // Escuta mudanças de autenticação (login/logout)
        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
                setLoading(false);
            }
        );

        return () => {
            // Limpa o listener ao desmontar o componente
            listener?.subscription.unsubscribe();
        };
    }, []);

    if (loading) {
        // Exibir um spinner ou tela de carregamento
        return (
            <div className="flex items-center justify-center h-screen dark:bg-gray-900 dark:text-white">
                Carregando...
            </div>
        );
    }

    // Se não houver sessão, redireciona para o login
    if (!session) {
        return <Navigate to="/login" replace />;
    }

    // Se houver sessão, renderiza o componente filho (a rota protegida)
    return children;
}

export default AuthGuard;
