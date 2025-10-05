// src/hooks/useUpdateProfile.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';
// A chave da listagem AdminPage para forçar o refresh
const ADMIN_PROFILES_QUERY_KEY = 'adminProfiles';

/**
 * Hook para mutação (UPDATE) de perfis.
 */
export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    const updateProfileInDb = async ({ id, updates }) => {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) {
            // O RLS FOR UPDATE do backend causará o erro aqui se a permissão for negada!
            throw new Error(`Falha ao atualizar perfil: ${error.message}`);
        }
        return data;
    };

    return useMutation({
        mutationFn: updateProfileInDb,

        // Invalida o cache após o sucesso para forçar o refresh da lista e dos detalhes
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ADMIN_PROFILES_QUERY_KEY],
            });
            queryClient.invalidateQueries({ queryKey: ['profileDetails'] });
        },
    });
};
