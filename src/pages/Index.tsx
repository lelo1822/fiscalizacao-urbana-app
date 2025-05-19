
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { MapPin, ClipboardCheck, PanelLeftOpen, UserPlus, LogIn } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary/10 to-secondary/20">
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary">
          Câmara na Rua
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Sistema de monitoramento e gestão de ocorrências urbanas para prefeituras e câmara de vereadores
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-2xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-sm text-left">
            <div className="flex items-center mb-4">
              <div className="bg-primary/10 p-2 rounded-full mr-3">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Mapeamento Inteligente</h3>
            </div>
            <p className="text-gray-600">Visualize todas as ocorrências em um mapa interativo, filtre por tipo e status.</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm text-left">
            <div className="flex items-center mb-4">
              <div className="bg-primary/10 p-2 rounded-full mr-3">
                <ClipboardCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Gestão Completa</h3>
            </div>
            <p className="text-gray-600">Acompanhe o progresso das ocorrências, desde o registro até sua resolução.</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm text-left">
            <div className="flex items-center mb-4">
              <div className="bg-primary/10 p-2 rounded-full mr-3">
                <PanelLeftOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Relatórios Detalhados</h3>
            </div>
            <p className="text-gray-600">Gere relatórios estatísticos e exporte dados para análise e transparência.</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm text-left">
            <div className="flex items-center mb-4">
              <div className="bg-primary/10 p-2 rounded-full mr-3">
                <UserPlus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Multiusuário</h3>
            </div>
            <p className="text-gray-600">Sistema completo para vereadores, assessores e equipes técnicas.</p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate('/login')}
            size="lg"
            className="bg-primary hover:bg-primary/90"
          >
            <LogIn className="h-5 w-5 mr-2" /> Entrar no Sistema
          </Button>
          <Button 
            onClick={() => navigate('/register')}
            variant="outline" 
            size="lg"
            className="border-primary text-primary hover:bg-primary/10"
          >
            <UserPlus className="h-5 w-5 mr-2" /> Cadastrar Novo Agente
          </Button>
        </div>
        
        <div className="mt-16 text-sm text-gray-500">
          <p>© 2025 Câmara na Rua - Todos os direitos reservados</p>
          <p className="mt-1">Versão 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
