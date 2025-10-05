import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabaseClient'; // Ajuste o caminho conforme seu projeto

const ADMIN_PROFILES_QUERY_KEY = 'adminProfiles';

/**
 * Hook customizado (TanStack Query) para buscar a lista de perfis do Painel Admin.
 * * Utiliza a função RPC 'get_admin_profiles', que executa o JOIN SQL (profiles com auth.users)
 * e aplica o filtro de segurança hierárquica diretamente no banco de dados.
 * * @returns Um objeto contendo data (perfis com email), isLoading, isError, error e refetch.
 */
export const useAdminProfiles = () => {
    const fetchProfiles = async () => {
        // CHAMADA RPC: O método mais limpo e eficiente para executar JOINs complexos.
        // A função SQL 'get_admin_profiles' encapsula a sua lógica SELECT JOIN WHERE.
        const { data, error } = await supabase
            .rpc('get_admin_profiles')
            .order('nome', { ascending: false }); // Opcional: ordenar no cliente

        if (error) {
            // O erro é capturado pelo React Query para tratamento no componente AdminPage.jsx
            console.error(
                'Erro na chamada RPC get_admin_profiles:',
                error.message
            );
            throw new Error(
                error.message || 'Falha ao carregar a lista de perfis via RPC.'
            );
        }

        // A função SQL retorna os dados já filtrados e limpos (com o campo 'email').
        return data;
    };

    // Retorna a query encapsulada pelo React Query
    return useQuery({
        queryKey: [ADMIN_PROFILES_QUERY_KEY],
        queryFn: fetchProfiles,
        // Define um tempo para manter o cache 'fresco' (staleTime)
        staleTime: 1000 * 60 * 5,
    });
};
