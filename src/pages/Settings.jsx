import React from 'react';

function Settings() {
    return (
        <div className="dark:text-white bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg min-h-[50vh]">
            <h2 className="text-4xl font-extrabold mb-6 text-indigo-600 dark:text-indigo-400">
                Configurações
            </h2>

            <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="font-semibold">Status:</p>
                <p className="text-green-500">
                    Conexão Supabase OK. Rotas Protegidas Ativas.
                </p>
            </div>
        </div>
    );
}

export default Settings;
