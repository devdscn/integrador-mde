import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkTheme, setIsDarkTheme] = useState(() => {
        // Tenta obter o tema do localStorage ou usa o preferido do sistema
        if (localStorage.getItem('theme') === 'dark') {
            return true;
        }
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return true;
        }
        return false;
    });

    // Efeito para aplicar a classe 'dark' ao corpo do documento (para o Tailwind)
    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkTheme) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkTheme]);

    const toggleTheme = () => {
        setIsDarkTheme((prev) => !prev);
    };

    return (
        <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Hook customizado
export const useTheme = () => useContext(ThemeContext);
