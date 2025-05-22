
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import RegisterForm from "./RegisterForm";
import { useIsMobile } from "@/hooks/use-mobile";

const RegisterCard = () => {
  const isMobile = useIsMobile();
  
  return (
    <Card className={`shadow-lg ${isMobile ? "px-2 py-4" : ""}`}>
      <CardHeader className="space-y-1">
        <div className="flex flex-col items-center justify-center">
          <img 
            src="/lovable-uploads/dce4f081-f924-447d-965b-1668df335311.png" 
            alt="Câmara Municipal de Osasco" 
            className={`${isMobile ? "h-16" : "h-24"} w-auto mb-2`}
          />
        </div>
        <CardDescription className="text-center">
          Preencha os dados para cadastrar um novo agente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center text-gray-500">
          Já tem uma conta?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Faça login
          </Link>
        </div>
        <div className="text-center font-semibold text-primary">
          Câmara na Rua
        </div>
      </CardFooter>
    </Card>
  );
};

export default RegisterCard;
