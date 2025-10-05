import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    HomeIcon,
    Cog6ToothIcon,
    UserIcon,
    Bars3Icon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

const navItems = [
    { name: 'Dashboard', to: '/dashboard', icon: HomeIcon },
    { name: 'Configurações', to: '/settings', icon: Cog6ToothIcon },
    { name: 'Profile', to: '/profile', icon: UserIcon },
];

function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const activeClass = 'bg-indigo-600 text-white shadow-lg';
    const inactiveClass =
        'text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-700';

    const NavLink = ({ item }) => {
        const isActive = location.pathname === item.to;
        return (
            <Link
                to={item.to}
                className={`flex items-center p-3 rounded-lg transition-all duration-200 font-medium ${
                    isActive ? activeClass : inactiveClass
                }`}
                onClick={() => setIsOpen(false)}
            >
                <item.icon className="w-6 h-6 mr-3" />
                {item.name}
            </Link>
        );
    };

    return (
        <>
            {/* Botão de abrir/fechar no mobile */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-indigo-600 text-white shadow-lg"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? (
                    <XMarkIcon className="w-6 h-6" />
                ) : (
                    <Bars3Icon className="w-6 h-6" />
                )}
            </button>

            {/* Sidebar - Desktop */}
            <aside
                className={`fixed inset-y-0 left-0 transform ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out w-64 bg-white dark:bg-gray-800 shadow-xl lg:shadow-none p-4 z-40`}
            >
                <h2 className="text-2xl font-bold text-indigo-600 mb-6 border-b pb-2 dark:border-gray-700">
                    Integrador Mde
                </h2>
                <nav className="space-y-2">
                    {navItems.map((item) => (
                        <NavLink key={item.name} item={item} />
                    ))}
                </nav>
            </aside>

            {/* Overlay para mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </>
    );
}

export default Sidebar;
