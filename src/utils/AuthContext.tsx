import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login } from '../services/apiFetcher';

interface AuthContextProps {
    token: string | null;
}

const AuthContext = createContext<AuthContextProps>({ token: null });

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const fetchToken = async () => {
            const token = await login();
            setToken(token);
        };
        fetchToken();
    }, []);

    return (
        <AuthContext.Provider value={{ token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);