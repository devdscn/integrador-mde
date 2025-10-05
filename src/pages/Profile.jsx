// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useFetchProfile, useUpdateProfile } from '../hooks/useProfile';

const REQUIRED_FIELDS = ['nome', 'apelido', 'telefone'];

function Profile() {
    // 💡 RECEBE isLoadingAuth DO HOOK
    const {
        data: profileData,
        isLoading: isFetching,
        isFetched,
        error: fetchError,
        isLoadingAuth, // 💡 NOVO: Estado de carregamento da Autenticação
    } = useFetchProfile();

    const profileExists = profileData !== null && profileData !== undefined;
    const updateMutation = useUpdateProfile(profileExists);

    // Estado local do formulário (inicializa com dados ou com objeto vazio)
    const [formData, setFormData] = useState({
        apelido: '',
        nome: '',
        telefone: '',
        endereco: '',
        numero: '',
        bairro: '',
        cidade: '',
        uf: '',
        cep: '',
        cpf: '',
        cnh: '',
    });
    const [localError, setLocalError] = useState(null);

    // SINCRONIZAÇÃO: Atualiza o formData quando os dados do Query mudam
    useEffect(() => {
        if (profileData) {
            setFormData(profileData);
        }
    }, [profileData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setLocalError(null);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLocalError(null);

        const missingField = REQUIRED_FIELDS.find(
            (field) => !formData[field] || formData[field].trim() === ''
        );
        if (missingField) {
            setLocalError(
                `O campo "${missingField.toUpperCase()}" é obrigatório.`
            );
            return;
        }

        updateMutation.mutate(formData, {
            onError: (err) => {
                if (err.code === '23505') {
                    setLocalError('Apelido já em uso. Escolha outro.');
                } else {
                    setLocalError(
                        err.message || 'Erro desconhecido ao salvar.'
                    );
                }
            },
        });
    };

    const fields = [
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

    const isLoading = isFetching || updateMutation.isPending;

    // 💡 VERIFICAÇÃO DE CARREGAMENTO CORRIGIDA: Espera por isLoadingAuth OU isFetching
    if (isLoadingAuth || (isFetching && !isFetched)) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] dark:text-white">
                Carregando dados do perfil...
            </div>
        );
    }

    // Lógica de Erro
    if (fetchError) {
        return (
            <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-500 min-h-[50vh] flex items-center justify-center">
                Erro ao buscar perfil: {fetchError.message}
            </div>
        );
    }

    // Define o texto do botão
    const buttonText = updateMutation.isPending
        ? profileExists
            ? 'Salvando...'
            : 'Criando...'
        : profileExists
        ? 'Salvar Alterações'
        : 'Criar Perfil';

    // Define a mensagem de sucesso
    const successMessage = updateMutation.isSuccess
        ? profileExists
            ? 'Perfil atualizado com sucesso!'
            : 'Perfil criado com sucesso!'
        : null;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-4xl font-extrabold mb-8 text-indigo-600 dark:text-indigo-400 border-b pb-4">
                {profileExists
                    ? 'Edição de Perfil'
                    : 'Primeiro Cadastro de Perfil'}
            </h2>

            <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {fields.map((field) => (
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
                                value={formData[field.name]}
                                onChange={handleChange}
                                required={field.required}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                    ))}
                </div>

                {/* Mensagens de Feedback */}
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

export default Profile;
