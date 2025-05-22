
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary">
      <div className="w-full max-w-md mx-auto px-4 py-12 text-center">
        <div className="mb-16">
          <img 
            src="/lovable-uploads/81a0c674-764e-4cc6-9635-fb50e91c47d7.png" 
            alt="Câmara Municipal de Osasco" 
            className="mx-auto w-3/4 max-w-xs"
          />
        </div>
        
        <div className="flex flex-col gap-4">
          <Button 
            onClick={() => navigate('/dashboard')}
            size="lg"
            className="bg-white text-primary hover:bg-white/90 h-14 text-lg"
          >
            ACESSAR APP
          </Button>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Button 
              onClick={() => navigate('/login')}
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white/10 h-14 text-lg"
            >
              LOGIN
            </Button>
            <Button 
              onClick={() => navigate('/register')}
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white/10 h-14 text-lg"
            >
              CADASTRAR
            </Button>
          </div>
        </div>
        
        <div className="mt-16 text-sm text-white/70">
          <p>© 2025 Câmara na Rua - Todos os direitos reservados</p>
          <p className="mt-1">Versão 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
