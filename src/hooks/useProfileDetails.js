// src/hooks/useProfileDetails.js
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';

/**
 * Hook para buscar os detalhes de um perfil específico.
 * @param {string} profileId - O ID do perfil a ser buscado.
 */
export const useProfileDetails = (profileId) => {
    const fetchProfile = async () => {
        // 1. Busca os dados de perfil (RLS garante que você só veja o que pode)
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select(`id, apelido, nome, role, telefone, created_at`)
            .eq('id', profileId)
            .single();

        if (profileError || !profile) {
            throw new Error(
                profileError?.message ||
                    'Perfil não encontrado ou acesso negado.'
            );
        }

        // 2. Busca o email separadamente (usamos o alias 'users' que costuma funcionar para SELECTs simples)
        const { data: authData } = await supabase
            .from('users')
            .select('email')
            .eq('id', profileId)
            .single();

        // Junta os dados
        return {
            ...profile,
            email: authData?.email || 'Email Indisponível',
        };
    };

    return useQuery({
        queryKey: ['profileDetails', profileId],
        queryFn: fetchProfile,
        enabled: !!profileId,
    });
};
