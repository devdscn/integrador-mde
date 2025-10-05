// src/components/Spinner.jsx

import React from 'react';

/**
 * Componente simples de Spinner para uso em loadings e Suspense.
 */
const Spinner = ({ size = 'md' }) => {
    // Determina o tamanho do spinner
    const sizeClasses = {
        sm: 'w-6 h-6 border-2',
        md: 'w-8 h-8 border-4',
        lg: 'w-12 h-12 border-4',
    };

    return (
        <div className="flex items-center justify-center h-full min-h-[50vh]">
            <div
                className={`
                    ${sizeClasses[size]} 
                    border-indigo-500 
                    border-t-transparent 
                    rounded-full 
                    animate-spin
                    dark:border-indigo-400
                    dark:border-t-transparent
                `}
                role="status"
            >
                <span className="sr-only">Carregando...</span>
            </div>
        </div>
    );
};

export default Spinner;
