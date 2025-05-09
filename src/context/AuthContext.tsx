
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'agent';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: 'admin' | 'agent') => Promise<boolean>;
}

// Dummy users for demonstration (would be replaced by API calls in a real app)
const dummyUsers = [
  { id: '1', name: 'Admin', email: 'admin@prefeitura.gov.br', password: 'admin123', role: 'admin' as const },
  { id: '2', name: 'Agente Silva', email: 'agente@prefeitura.gov.br', password: 'agente123', role: 'agent' as const }
];

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user data exists in localStorage (simulate session persistence)
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Simulating API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user with matching credentials
      const foundUser = dummyUsers.find(
        u => u.email === email && u.password === password
      );

      if (foundUser) {
        // Create user data without password
        const { password, ...userData } = foundUser;
        setUser(userData);
        setIsAuthenticated(true);
        // Store in localStorage to persist session
        localStorage.setItem('currentUser', JSON.stringify(userData));
        toast.success(`Bem-vindo, ${userData.name}!`);
        return true;
      } else {
        toast.error('Credenciais inválidas');
        return false;
      }
    } catch (error) {
      toast.error('Erro ao fazer login');
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    toast.info('Você saiu do sistema');
  };

  const register = async (name: string, email: string, password: string, role: 'admin' | 'agent') => {
    try {
      // Simulating API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user already exists
      if (dummyUsers.some(user => user.email === email)) {
        toast.error('Email já cadastrado');
        return false;
      }

      // In a real app, this would be an API call to create a user
      // For demo purposes, we're just simulating success
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role
      };

      // In a real app, this would update the database
      // dummyUsers.push({ ...newUser, password });

      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      toast.success('Cadastro realizado com sucesso!');
      return true;
    } catch (error) {
      toast.error('Erro ao registrar');
      console.error('Registration error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticated, 
      login, 
      logout, 
      register 
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
