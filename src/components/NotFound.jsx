// src/pages/NotFound.jsx

import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        // Centraliza o conteúdo na tela
        <div className="flex flex-col items-center justify-center min-h-[80vh] bg-white dark:bg-gray-900 px-4">
            <div className="text-center">
                {/* Código de Erro Grande */}
                <h1 className="text-9xl font-extrabold text-indigo-600 dark:text-indigo-500 tracking-widest">
                    404
                </h1>

                {/* Mensagem Principal */}
                <div className="bg-red-500 text-white px-2 text-sm rounded rotate-12 absolute -translate-x-1/2 left-1/2 top-1/2 -mt-4">
                    PÁGINA NÃO ENCONTRADA
                </div>

                {/* Mensagem Explicativa */}
                <p className="mt-5 text-xl text-gray-700 dark:text-gray-300">
                    Desculpe, a página que você está procurando não existe ou
                    foi movida.
                </p>

                {/* Botão de Navegação */}
                <Link
                    to="/dashboard"
                    className="mt-8 inline-block px-6 py-3 text-sm font-medium leading-5 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                    Ir para o Dashboard
                </Link>
            </div>
        </div>
    );
}

export default NotFound;
