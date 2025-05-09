
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/10 to-secondary/20">
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary">
          CidadeMon
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Sistema de monitoramento e gestão de ocorrências urbanas para prefeituras
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate('/login')}
            size="lg"
            className="bg-primary hover:bg-primary/90"
          >
            Entrar no Sistema
          </Button>
          <Button 
            onClick={() => navigate('/register')}
            variant="outline" 
            size="lg"
            className="border-primary text-primary hover:bg-primary/10"
          >
            Cadastrar Novo Agente
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
