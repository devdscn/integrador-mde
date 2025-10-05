// // import React from 'react';

// // function Profile() {
// //     return (
// //         <div className="dark:text-white bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg min-h-[50vh]">
// //             <h2 className="text-4xl font-extrabold mb-6 text-indigo-600 dark:text-indigo-400">
// //                 Perfil
// //             </h2>

// //             <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
// //                 <p className="font-semibold">Status:</p>
// //                 <p className="text-green-500">
// //                     Conexão Supabase OK. Rotas Protegidas Ativas.
// //                 </p>
// //             </div>
// //         </div>
// //     );
// // }

// // export default Profile;

// // src/pages/Profile.jsx
// import React, { useState, useEffect } from 'react';
// import { useFetchProfile, useUpdateProfile } from '../hooks/useProfile';

// const REQUIRED_FIELDS = ['nome', 'apelido', 'telefone'];

// function Profile() {
//     // 💡 1. BUSCA DE DADOS COM useQuery
//     const {
//         data: profileData, // Dados do perfil (null se não existir)
//         isLoading: isFetching, // Estado de carregamento inicial
//         isFetched, // Indica que a busca inicial já foi feita
//         error: fetchError, // Erro na busca
//     } = useFetchProfile();

//     // NOVO ESTADO: profileExists agora é derivado de profileData
//     const profileExists = profileData !== null && profileData !== undefined;

//     // 💡 2. MUTATION (ENVIO DE DADOS) COM useMutation
//     const updateMutation = useUpdateProfile(profileExists);

//     // Estado local do formulário (inicializa com dados ou com objeto vazio)
//     const [formData, setFormData] = useState({
//         apelido: '',
//         nome: '',
//         telefone: '',
//         endereco: '',
//         numero: '',
//         bairro: '',
//         cidade: '',
//         uf: '',
//         cep: '',
//         cpf: '',
//         cnh: '',
//     });
//     const [localError, setLocalError] = useState(null);

//     // 3. SINCRONIZAÇÃO: Atualiza o formData quando os dados do Query mudam
//     useEffect(() => {
//         if (profileData) {
//             setFormData(profileData);
//         }
//     }, [profileData]);

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//         setLocalError(null); // Limpa erro ao digitar
//     };

//     const handleUpdate = async (e) => {
//         e.preventDefault();
//         setLocalError(null);

//         // Validação de campos obrigatórios
//         const missingField = REQUIRED_FIELDS.find(
//             (field) => !formData[field] || formData[field].trim() === ''
//         );
//         if (missingField) {
//             setLocalError(
//                 `O campo "${missingField.toUpperCase()}" é obrigatório.`
//             );
//             return;
//         }

//         // Dispara a mutação
//         updateMutation.mutate(formData, {
//             onError: (err) => {
//                 // Trata erros específicos, como apelido duplicado (erro Supabase 23505)
//                 if (err.code === '23505') {
//                     setLocalError('Apelido já em uso. Escolha outro.');
//                 } else {
//                     setLocalError(
//                         err.message || 'Erro desconhecido ao salvar.'
//                     );
//                 }
//             },
//             onSuccess: () => {
//                 // O React Query invalida e refetch automaticamente,
//                 // mas podemos adicionar feedback visual aqui
//                 console.log('Salvo com sucesso!');
//             },
//         });
//     };

//     // Estrutura de campos para renderização (usando nomes em português)
//     const fields = [
//         { label: 'Nome', name: 'nome', required: true },
//         { label: 'Apelido', name: 'apelido', required: true },
//         { label: 'Telefone', name: 'telefone', required: true },
//         { label: 'CPF', name: 'cpf', required: false },
//         { label: 'CNH', name: 'cnh', required: false },
//         { label: 'CEP', name: 'cep', required: false },
//         { label: 'Endereço', name: 'endereco', required: false },
//         { label: 'Número', name: 'numero', required: false },
//         { label: 'Bairro', name: 'bairro', required: false },
//         { label: 'Cidade', name: 'cidade', required: false },
//         { label: 'UF', name: 'uf', required: false },
//     ];

//     // Determina o estado de carregamento combinado (busca + salvamento)
//     const isLoading = isFetching || updateMutation.isPending;

//     // Lógica de Renderização de Carregamento
//     if (isFetching && !isFetched) {
//         return (
//             <div className="flex items-center justify-center min-h-[50vh] dark:text-white">
//                 Carregando dados do perfil...
//             </div>
//         );
//     }

//     // Lógica de Erro
//     if (fetchError) {
//         return (
//             <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-500 min-h-[50vh] flex items-center justify-center">
//                 Erro ao buscar perfil: {fetchError.message}
//             </div>
//         );
//     }

//     // Define o texto do botão com base no estado
//     const buttonText = updateMutation.isPending
//         ? profileExists
//             ? 'Salvando...'
//             : 'Criando...'
//         : profileExists
//         ? 'Salvar Alterações'
//         : 'Criar Perfil';

//     // Define a mensagem de sucesso
//     const successMessage = updateMutation.isSuccess
//         ? profileExists
//             ? 'Perfil atualizado com sucesso!'
//             : 'Perfil criado com sucesso!'
//         : null;

//     return (
//         <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
//             <h2 className="text-4xl font-extrabold mb-8 text-indigo-600 dark:text-indigo-400 border-b pb-4">
//                 {profileExists
//                     ? 'Edição de Perfil'
//                     : 'Primeiro Cadastro de Perfil'}
//             </h2>

//             <form onSubmit={handleUpdate} className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {fields.map((field) => (
//                         <div key={field.name}>
//                             <label
//                                 htmlFor={field.name}
//                                 className="block text-sm font-medium text-gray-700 dark:text-gray-300"
//                             >
//                                 {field.label}{' '}
//                                 {field.required && (
//                                     <span className="text-red-500">*</span>
//                                 )}
//                             </label>
//                             <input
//                                 type="text"
//                                 id={field.name}
//                                 name={field.name}
//                                 value={formData[field.name]}
//                                 onChange={handleChange}
//                                 required={field.required}
//                                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                             />
//                         </div>
//                     ))}
//                 </div>

//                 {/* Mensagens de Feedback */}
//                 {(localError || updateMutation.isError) && (
//                     <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-500">
//                         Erro: {localError || updateMutation.error.message}
//                     </div>
//                 )}
//                 {successMessage && (
//                     <div className="p-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-500">
//                         {successMessage}
//                     </div>
//                 )}

//                 <button
//                     type="submit"
//                     disabled={isLoading}
//                     className="w-full md:w-auto px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
//                 >
//                     {buttonText}
//                 </button>
//             </form>
//         </div>
//     );
// }

// export default Profile;

// src/hooks/useProfile.js
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';

const TABLE_NAME = 'profiles'; // Tabela correta
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
];

/**
 * Hook para buscar o perfil do usuário logado.
 * * 💡 Estratégia de Segurança:
 * O ID do usuário (userId) é usado como parte da chave de cache do React Query,
 * garantindo que a sessão de cache de um usuário não se misture com a de outro.
 */
export const useFetchProfile = () => {
    // Estado local para armazenar o ID do usuário (obtido via Supabase)
    const [userId, setUserId] = useState(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);

    // Efeito para carregar o ID do usuário (executa na montagem)
    useEffect(() => {
        // Obter o usuário logado para extrair o ID
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUserId(user?.id || null);
            setIsLoadingAuth(false);
        });
    }, []);

    // 💡 CHAVE DINÂMICA: A chave de cache agora depende do userId.
    const QUERY_KEY = ['userProfile', userId];

    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: async () => {
            // Se o ID ainda for null (usuário deslogado), a função não deve ser chamada.
            if (!userId) return null;

            const { data, error, status } = await supabase
                .from(TABLE_NAME)
                .select(DB_COLUMNS.join(','))
                .eq('id', userId)
                .single();

            // Retorna null se não houver perfil (status 406 - No Rows)
            if (error && status !== 406) {
                throw error;
            }

            return data || null;
        },
        // A query só é ativada se tivermos o ID do usuário E o carregamento da autenticação tiver terminado
        enabled: !isLoadingAuth && userId !== null,
        staleTime: 1000 * 60 * 5, // 5 minutos de cache
    });
};

/**
 * Hook para criar (insert) ou atualizar (update) o perfil.
 * @param {boolean} profileExists - Indica se o perfil já existe no DB.
 */
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
                // UPDATE: Atualiza o registro existente
                dbCall = supabase
                    .from(TABLE_NAME)
                    .update({
                        ...payload,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', user.id)
                    .select();
            } else {
                // INSERT: Cria o registro pela primeira vez
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
            // Invalida a query de perfil para que o useFetchProfile busque os dados atualizados
            // A chave precisa ser a mesma usada no useFetchProfile, incluindo o userId.
            // Como o ID do usuário não está disponível diretamente aqui, usaremos a chave genérica
            // e deixaremos o useFetchProfile revalidar quando o userId for redefinido.
            // Ou, alternativamente (melhor performance):

            const userId = data.id; // O payload que retorna da mutação tem o ID
            queryClient.invalidateQueries({
                queryKey: ['userProfile', userId],
            });
            queryClient.setQueryData(['userProfile', userId], data);
        },
    });
};
