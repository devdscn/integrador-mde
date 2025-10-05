// src/App.jsx
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
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// 💡 IMPORTAR O SPINNER
import Spinner from './components/Spinner';

// Lazy Load dos componentes de página
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./components/NotFound'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const AdminEditProfilePage = lazy(() => import('./pages/AdminEditProfilePage'));

// Componente Layout Protegido
const ProtectedLayout = () => (
    <AuthGuard>
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    <Suspense fallback={<Spinner size="lg" />}>
                        {' '}
                        {/* 💡 SPINNER NO LAYOUT PROTEGIDO */}
                        <Outlet />
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
                    {/* Rotas Protegidas */}
                    <Route element={<ProtectedLayout />}>
                        <Route
                            path="/"
                            element={<Navigate to="/dashboard" replace />}
                        />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route
                            path="/admin/edit/:profileId"
                            element={<AdminEditProfilePage />}
                        />
                    </Route>

                    {/* Rotas Públicas */}
                    <Route
                        path="/login"
                        element={
                            <Suspense fallback={<Spinner size="lg" />}>
                                {' '}
                                {/* 💡 SPINNER NAS ROTAS PÚBLICAS */}
                                <Login />
                            </Suspense>
                        }
                    />

                    {/* Catch-all para 404 */}
                    <Route
                        path="*"
                        element={
                            <Suspense fallback={<Spinner size="lg" />}>
                                {' '}
                                {/* 💡 SPINNER NO CATCH-ALL */}
                                <NotFound />
                            </Suspense>
                        }
                    />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
