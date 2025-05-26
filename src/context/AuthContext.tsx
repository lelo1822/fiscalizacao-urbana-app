
import React, { createContext, useContext } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

// Definição dos gabinetes
export const GABINETES = Array.from({ length: 21 }, (_, i) => ({
  id: (i + 1).toString(),
  nome: `Gabinete ${i + 1}`
}));

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'agent' | 'vereador';
  gabineteId: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: 'admin' | 'agent' | 'vereador', gabineteId: string) => Promise<boolean>;
  getGabineteUsers: (gabineteId: string) => { vereadores: number, assessores: number };
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: supabaseUser, profile, loading, signIn, signOut, signUp, isAuthenticated } = useSupabaseAuth();

  // Convert Supabase user to our User interface
  const user: User | null = supabaseUser && profile ? {
    id: supabaseUser.id,
    name: profile.name,
    email: profile.email,
    role: profile.role,
    gabineteId: profile.gabinete_id,
  } : null;

  const login = async (email: string, password: string): Promise<boolean> => {
    const result = await signIn(email, password);
    return result.success;
  };

  const logout = () => {
    signOut();
  };

  const register = async (name: string, email: string, password: string, role: 'admin' | 'agent' | 'vereador', gabineteId: string): Promise<boolean> => {
    const result = await signUp(email, password, name, role, gabineteId);
    return result.success;
  };

  // Mock function for backward compatibility
  const getGabineteUsers = (gabineteId: string) => {
    return { vereadores: 0, assessores: 0 };
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading: loading, 
      isAuthenticated, 
      login, 
      logout, 
      register,
      getGabineteUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
