
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "sonner";

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

// Dummy users para demonstração (seria substituído por chamadas de API em um app real)
const dummyUsers = [
  { id: '1', name: 'Admin', email: 'admin@prefeitura.gov.br', password: 'admin123', role: 'admin' as const, gabineteId: '1' },
  { id: '2', name: 'Agente Silva', email: 'agente@prefeitura.gov.br', password: 'agente123', role: 'agent' as const, gabineteId: '1' },
  { id: '3', name: 'Vereador Costa', email: 'vereador@prefeitura.gov.br', password: 'vereador123', role: 'vereador' as const, gabineteId: '1' }
];

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Verificar se existem dados do usuário no localStorage (simular persistência de sessão)
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
      // Simulando atraso de requisição à API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Encontrar usuário com credenciais correspondentes
      const foundUser = dummyUsers.find(
        u => u.email === email && u.password === password
      );

      if (foundUser) {
        // Criar dados do usuário sem a senha
        const { password, ...userData } = foundUser;
        setUser(userData);
        setIsAuthenticated(true);
        // Armazenar no localStorage para persistir a sessão
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

  // Função para verificar quantos usuários de cada tipo existem em um gabinete
  const getGabineteUsers = (gabineteId: string) => {
    const gabineteUsers = dummyUsers.filter(user => user.gabineteId === gabineteId);
    const vereadores = gabineteUsers.filter(user => user.role === 'vereador').length;
    const assessores = gabineteUsers.filter(user => user.role === 'agent').length;
    
    return { vereadores, assessores };
  };

  const register = async (name: string, email: string, password: string, role: 'admin' | 'agent' | 'vereador', gabineteId: string) => {
    try {
      // Simulando atraso de requisição à API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verificar se o usuário já existe
      if (dummyUsers.some(user => user.email === email)) {
        toast.error('Email já cadastrado');
        return false;
      }

      // Verificar limites de usuários por gabinete
      const { vereadores, assessores } = getGabineteUsers(gabineteId);
      
      if (role === 'vereador' && vereadores >= 1) {
        toast.error('Este gabinete já possui um vereador cadastrado');
        return false;
      }
      
      if (role === 'agent' && assessores >= 8) {
        toast.error('Este gabinete já atingiu o limite de 8 assessores');
        return false;
      }

      // Em um app real, isso seria uma chamada à API para criar um usuário
      // Para demonstração, estamos apenas simulando sucesso
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role,
        gabineteId
      };

      // Em um app real, isso atualizaria o banco de dados
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
