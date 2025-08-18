import React, { createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  user: any;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  isAuthenticated: false,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Simple static auth for now
  const value = {
    user: null,
    loading: false,
    isAuthenticated: false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};