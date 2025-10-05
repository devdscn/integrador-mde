import React, { lazy, Suspense } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Outlet,
    Navigate,
} from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';

import AuthGuard from './components/AuthGuard';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Login from './pages/Login'; // O Login não é lazy para carregamento imediato

// Rotas Lazy Load (melhora o desempenho)
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));

// Componente Layout Protegido
const ProtectedLayout = () => (
    <AuthGuard>
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                {/* Conteúdo principal com scroll */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    <Suspense
                        fallback={
                            <div className="flex items-center justify-center h-full dark:text-white">
                                Carregando Conteúdo...
                            </div>
                        }
                    >
                        <Outlet /> {/* Renderiza a rota filha aqui */}
                    </Suspense>
                </main>
            </div>
        </div>
    </AuthGuard>
);

function App() {
    return (
        <ThemeProvider>
            <Router>
                <Routes>
                    {/* Rota de Login (Não Protegida) */}
                    <Route path="/login" element={<Login />} />

                    {/* Rotas Protegidas (Usando o Layout com Header e Sidebar) */}
                    <Route element={<ProtectedLayout />}>
                        {/* Redireciona a raiz (/) para /dashboard */}
                        <Route
                            path="/"
                            element={<Navigate to="/dashboard" replace />}
                        />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/profile" element={<Profile />} />
                    </Route>

                    {/* Rota 404 */}
                    <Route
                        path="*"
                        element={
                            <h1 className="text-3xl text-center p-10 dark:text-white dark:bg-gray-900 min-h-screen">
                                404 | Página Não Encontrada
                            </h1>
                        }
                    />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
