import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAdminProfiles } from '../hooks/useAdminProfiles'; // Importa o novo hook

function AdminPage() {
    const [currentUserRole, setCurrentUserRole] = useState(null);

    // 1. CHAMA O HOOK REACT QUERY
    // Este hook gerencia a busca segura de dados, cache, loading e erros.
    const { data: profiles, isLoading, isError, error } = useAdminProfiles();

    // Função para buscar a role do usuário logado (necessária para a lógica de UX)
    const fetchCurrentUserRole = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (user) {
            // Busca a role do perfil logado
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            setCurrentUserRole(profile?.role || 'user'); // Garante que a role seja definida
        } else {
            setCurrentUserRole(null);
        }
    };

    useEffect(() => {
        fetchCurrentUserRole();
    }, []);

    const handleEdit = (profileId) => {
        // IMPLEMENTAÇÃO FUTURA:
        // Você pode usar o useNavigate() do react-router-dom para ir para a tela de edição
        console.log(`Abrir tela de edição para o ID: ${profileId}`);
        // Ex: navigate(`/admin/edit/${profileId}`);
    };

    // Lógica de UX: Determina se o usuário logado PODE interagir com o perfil alvo
    const canEditProfile = (targetRole) => {
        // Admin pode editar qualquer um
        if (currentUserRole === 'admin') return true;

        // Moderator pode editar apenas perfis 'user' (regra hierárquica)
        if (currentUserRole === 'moderator' && targetRole === 'user')
            return true;

        return false;
    };

    // Lógica de UX: Estilização do Badge da Role
    const getRoleBadgeClass = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-red-700 text-white';
            case 'moderator':
                return 'bg-yellow-400 text-gray-900';
            case 'user':
            default:
                return 'bg-blue-600 text-white';
        }
    };

    // 2. TRATAMENTO DE ESTADOS (Loading, Erro, Proteção)

    if (isLoading || currentUserRole === null) {
        return (
            <div className="text-center p-8">
                <p>Carregando painel de administração...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center p-8 bg-red-100 border border-red-400 rounded mx-auto mt-10 max-w-lg">
                <p className="font-semibold text-red-700">
                    Erro ao carregar dados:
                </p>
                <p>{error.message}</p>
            </div>
        );
    }

    // Proteção da Página: Se não for Admin ou Moderator, exibe acesso negado
    if (currentUserRole !== 'admin' && currentUserRole !== 'moderator') {
        return (
            <div className="text-center p-8 bg-red-100 border border-red-400 rounded mx-auto mt-10 max-w-lg">
                <h2 className="text-xl font-semibold text-red-700">
                    Acesso Negado
                </h2>
                <p className="text-red-600">
                    Você não tem permissão para visualizar este painel.
                </p>
            </div>
        );
    }

    // 3. RENDERIZAÇÃO DA TABELA

    return (
        <div className="p-8">
            <h1 className="text-3xl font-extrabold mb-6">
                Painel de Administração de Perfis ({profiles?.length || 0}{' '}
                encontrados)
            </h1>
            <p className="mb-4 text-sm text-gray-600">
                Você está logado como:{' '}
                <span
                    className={`font-semibold ${getRoleBadgeClass(
                        currentUserRole
                    )} px-2 py-1 rounded-full`}
                >
                    {currentUserRole}
                </span>
            </p>

            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nome / Apelido
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email / Telefone
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {profiles?.map((profile) => (
                            <tr key={profile.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {profile.nome}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        @{profile.apelido}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {/* O email agora vem direto do mapeamento no hook */}
                                    <div className="text-sm text-gray-500">
                                        {profile.email || 'N/A'}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {profile.telefone}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(
                                            profile.role
                                        )}`}
                                    >
                                        {profile.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {canEditProfile(profile.role) ? (
                                        <button
                                            onClick={() =>
                                                handleEdit(profile.id)
                                            }
                                            className="text-indigo-600 hover:text-indigo-900 font-bold"
                                            title="Editar Perfil"
                                        >
                                            ✏️ Editar
                                        </button>
                                    ) : (
                                        <span className="text-gray-400">
                                            Sem Ação
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminPage;
