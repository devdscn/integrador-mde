// src/hooks/useProfile.js
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';

const TABLE_NAME = 'profiles';
const DB_COLUMNS = [
    'apelido',
    'nome',
    'telefone',
    'endereco',
    'numero',
    'bairro',
    'cidade',
    'uf',
    'cep',
    'cpf',
    'cnh',
    'role',
];

/**
 * Hook para buscar o perfil do usuário logado.
 */
export const useFetchProfile = () => {
    // Estado local para armazenar o ID do usuário
    const [userId, setUserId] = useState(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true); // 💡 NOVO ESTADO

    // Efeito para carregar o ID do usuário
    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUserId(user?.id || null);
            setIsLoadingAuth(false); //
        });
    }, []);

    // CHAVE DINÂMICA: A chave de cache agora depende do userId.
    const QUERY_KEY = ['userProfile', userId];

    const queryResult = useQuery({
        queryKey: QUERY_KEY,
        queryFn: async () => {
            if (!userId) return null;

            const { data, error, status } = await supabase
                .from(TABLE_NAME)
                .select(DB_COLUMNS.join(','))
                .eq('id', userId)
                .single();

            if (error && status !== 406) {
                throw error;
            }

            return data || null;
        },
        // A query só é ativada se tivermos o ID do usuário E o Auth tiver carregado
        enabled: !isLoadingAuth && userId !== null,
        staleTime: 1000 * 60 * 5,
    });

    // 💡 RETORNA O ESTADO DE CARREGAMENTO DA AUTENTICAÇÃO
    return { ...queryResult, isLoadingAuth };
};

// -------------------------------------------------------------
// useUpdateProfile (Não precisa de alteração)
// -------------------------------------------------------------
export const useUpdateProfile = (profileExists) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (profileData) => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuário não autenticado.');

            const payload = { ...profileData, id: user.id };

            let dbCall;

            if (profileExists) {
                dbCall = supabase
                    .from(TABLE_NAME)
                    .update({
                        ...payload,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', user.id)
                    .select();
            } else {
                dbCall = supabase
                    .from(TABLE_NAME)
                    .insert({
                        ...payload,
                        created_at: new Date().toISOString(),
                    })
                    .select();
            }

            const { error } = await dbCall;

            if (error) throw error;
            return payload;
        },
        onSuccess: (data) => {
            const userId = data.id;
            queryClient.invalidateQueries({
                queryKey: ['userProfile', userId],
            });
            queryClient.setQueryData(['userProfile', userId], data);
        },
    });
};
