
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import LoginForm from "./LoginForm";

const LoginCard = () => {
  return (
    <Card className="shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex flex-col items-center justify-center">
          <img 
            src="/lovable-uploads/dce4f081-f924-447d-965b-1668df335311.png" 
            alt="Câmara Municipal de Osasco" 
            className="h-24 w-auto mb-2"
          />
        </div>
        <CardDescription className="text-center">
          Entre com suas credenciais para acessar o sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center text-gray-500">
          Não tem uma conta?{" "}
          <Link to="/register" className="text-primary hover:underline">
            Cadastre-se
          </Link>
        </div>
        <div className="text-center font-semibold text-primary">
          Câmara na Rua
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginCard;
