import React, { useEffect, useState } from 'react';
import './ThemeToggle.css';

const ThemeToggle: React.FC = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        const saved = localStorage.getItem('app-theme');
        if (saved === 'dark' || saved === 'light') return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('app-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <button 
            type="button" 
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Passer en mode ${theme === 'light' ? 'sombre' : 'clair'}`}
            title={`Passer en mode ${theme === 'light' ? 'sombre' : 'clair'}`}
        >
            {theme === 'light' ? '🌙' : '☀️'}
        </button>
    );
};

export default ThemeToggle;