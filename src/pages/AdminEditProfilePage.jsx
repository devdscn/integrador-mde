// src/pages/AdminEditProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useProfileDetails } from '../hooks/useProfileDetails';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import Spinner from '../components/Spinner';

// Lista de campos (igual à Profile.jsx, mas sem email)
const FIELDS = [
    { label: 'Nome', name: 'nome', required: true },
    { label: 'Apelido', name: 'apelido', required: true },
    { label: 'Telefone', name: 'telefone', required: true },
    { label: 'CPF', name: 'cpf', required: false },
    { label: 'CNH', name: 'cnh', required: false },
    { label: 'CEP', name: 'cep', required: false },
    { label: 'Endereço', name: 'endereco', required: false },
    { label: 'Número', name: 'numero', required: false },
    { label: 'Bairro', name: 'bairro', required: false },
    { label: 'Cidade', name: 'cidade', required: false },
    { label: 'UF', name: 'uf', required: false },
];

function AdminEditProfilePage() {
    const { profileId } = useParams();
    const navigate = useNavigate();

    const [currentUserRole, setCurrentUserRole] = useState(null);
    const [localError, setLocalError] = useState(null);

    // Hooks do TanStack Query
    const { data: profile, isLoading: isFetching } =
        useProfileDetails(profileId);
    const updateMutation = useUpdateProfile();

    const [formData, setFormData] = useState({});

    // 1. Lógica de Inicialização
    useEffect(() => {
        // Busca a role do usuário logado (para a regra 'canEditRole')
        const fetchRole = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (user) {
                const { data: p } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();
                setCurrentUserRole(p?.role);
            }
        };
        fetchRole();

        // Preenche o formulário
        if (profile) {
            const { email, ...editableData } = profile;
            setFormData(editableData);
        }
    }, [profile]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setLocalError(null);
    };

    // 2. Lógica de Submissão
    const handleUpdate = (e) => {
        e.preventDefault();
        setLocalError(null);

        // Lógica de validação básica (apenas para Nome/Apelido/Telefone)
        const requiredFields = ['nome', 'apelido', 'telefone'];
        const missingField = requiredFields.find(
            (field) => !formData[field] || formData[field].trim() === ''
        );
        if (missingField) {
            setLocalError(
                `O campo "${missingField.toUpperCase()}" é obrigatório.`
            );
            return;
        }

        // Remove o campo 'email' e outros que não devem ser enviados para a mutação
        const { email, ...updatesToSend } = formData;

        updateMutation.mutate(
            { id: profileId, updates: updatesToSend },
            {
                onSuccess: () => {
                    alert('Perfil atualizado com sucesso!');
                    navigate('/admin');
                },
                onError: (error) => {
                    setLocalError(
                        error.message || 'Erro desconhecido ao salvar.'
                    );
                },
            }
        );
    };

    const isLoading = isFetching || updateMutation.isPending;
    const canEditRole = currentUserRole === 'admin';

    // 3. Tratamento de Estados (Carregamento e Erro)
    if (isLoading || currentUserRole === null) {
        return <Spinner size="lg" />;
    }

    if (!profile)
        return (
            <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-500 min-h-[50vh] flex items-center justify-center">
                Perfil não encontrado ou erro de acesso.
            </div>
        );

    const buttonText = updateMutation.isPending
        ? 'Salvando...'
        : 'Salvar Alterações';
    const successMessage = updateMutation.isSuccess
        ? 'Perfil atualizado com sucesso!'
        : null;

    // 4. Estrutura de Design (IDÊNTICO a Profile.jsx)
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-4xl font-extrabold mb-8 text-indigo-600 dark:text-indigo-400 border-b pb-4">
                Editando Perfil: {profile.nome}
            </h2>

            <form onSubmit={handleUpdate} className="space-y-6">
                {/* Email do Usuário (Campo não editável) */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email (Não Editável)
                    </label>
                    <p className="mt-1 text-base font-semibold text-gray-800 dark:text-white">
                        {profile.email}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        O email está vinculado à autenticação e não pode ser
                        alterado por aqui.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Renderiza todos os campos padrão */}
                    {FIELDS.map((field) => (
                        <div key={field.name}>
                            <label
                                htmlFor={field.name}
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                {field.label}{' '}
                                {field.required && (
                                    <span className="text-red-500">*</span>
                                )}
                            </label>
                            <input
                                type="text"
                                id={field.name}
                                name={field.name}
                                value={formData[field.name] || ''}
                                onChange={handleInputChange}
                                required={field.required}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                    ))}

                    {/* Campo ROLE (CRÍTICO - Fora do loop de campos padrão) */}
                    <div>
                        <label
                            htmlFor="role"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Role
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role || ''}
                            onChange={handleInputChange}
                            disabled={!canEditRole} // Desabilita se não for Admin
                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white 
                                ${
                                    !canEditRole
                                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed'
                                        : ''
                                }`}
                        >
                            <option value="user">user</option>
                            <option value="moderator">moderator</option>
                            <option value="admin">admin</option>
                        </select>
                        {!canEditRole && (
                            <p className="text-xs text-red-500 mt-1">
                                Apenas o Admin pode alterar o nível de acesso
                                (Role).
                            </p>
                        )}
                    </div>
                </div>

                {/* Mensagens de Feedback (Erro e Sucesso) */}
                {(localError || updateMutation.isError) && (
                    <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-500">
                        Erro: {localError || updateMutation.error.message}
                    </div>
                )}
                {successMessage && (
                    <div className="p-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-500">
                        {successMessage}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full md:w-auto px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                >
                    {buttonText}
                </button>
            </form>
        </div>
    );
}

export default AdminEditProfilePage;
