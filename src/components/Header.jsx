import React from 'react';
import { supabase } from '../supabaseClient';
import { useTheme } from '../contexts/ThemeContext';
import {
    SunIcon,
    MoonIcon,
    UserCircleIcon,
    ArrowLeftEndOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
// 💡 ADICIONADO: Importar o hook que busca os dados do perfil
import { useFetchProfile } from '../hooks/useProfile';

function Header() {
    const { isDarkTheme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    // 💡 ADICIONADO: Busca os dados do perfil com React Query
    // isProfileLoading é o estado que usaremos para o skeleton/carregamento
    const { data: profileData, isLoading: isProfileLoading } =
        useFetchProfile();

    // 💡 ADICIONADO: Define qual nome exibir (preferência: Apelido, fallback: Nome)
    const displayName =
        'Olá, ' + profileData?.apelido ||
        'Olá, ' + profileData?.nome ||
        'Perfil';

    const handleLogout = async () => {
        await supabase.auth.signOut();
        // Redireciona para o login após o logout
        navigate('/login', { replace: true });
    };

    // URL mockada (você pode substituir isso pela URL do avatar do Supabase Storage se tiver uma)
    const avatarUrl = 'https://i.pravatar.cc/150?img=3';

    return (
        <header className="flex items-center justify-between p-4 bg-white shadow-md dark:bg-gray-800 transition-colors duration-300">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                {/* Dashboard */}
            </h1>

            <div className="flex items-center space-x-4">
                {/* 💡 ADICIONADO: Informação do Nome do Usuário */}
                <div
                    className="hidden sm:flex flex-col items-end text-sm cursor-pointer"
                    onClick={() => navigate('/profile')} // Clicável para ir ao perfil
                >
                    {isProfileLoading ? (
                        // Skeleton Effect enquanto carrega
                        <div className="h-4 w-20 mt-1 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    ) : (
                        <span className="font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            {displayName}
                        </span>
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {isProfileLoading ? 'Carregando...' : profileData?.role}
                    </span>
                </div>

                {/* 1. Botão de Alternar Tema */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-gray-500 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors"
                    title={`Alternar para tema ${
                        isDarkTheme ? 'claro' : 'escuro'
                    }`}
                >
                    {isDarkTheme ? (
                        <SunIcon className="w-6 h-6" />
                    ) : (
                        <MoonIcon className="w-6 h-6" />
                    )}
                </button>

                {/* 2. Área do Perfil (Dropdown) */}
                <div className="relative group">
                    <img
                        src={avatarUrl}
                        alt="Avatar do Usuário"
                        className="w-10 h-10 rounded-full cursor-pointer border-2 border-transparent group-hover:border-indigo-500 transition-all"
                    />

                    {/* Menu Dropdown (Simples) */}
                    <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible z-10 transition-all duration-300 ease-in-out transform scale-95 group-hover:scale-100">
                        <button
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors rounded-t-lg"
                            onClick={() => navigate('/profile')} // Navega para a página de perfil
                        >
                            <UserCircleIcon className="w-5 h-5 mr-2" />
                            Editar Perfil
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-600 transition-colors rounded-b-lg"
                        >
                            <ArrowLeftEndOnRectangleIcon className="w-5 h-5 mr-2" />
                            Sair
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
