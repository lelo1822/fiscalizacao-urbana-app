
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import RegisterForm from "./RegisterForm";

const RegisterCard = () => {
  return (
    <Card className="shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex flex-col items-center justify-center">
          <img 
            src="/lovable-uploads/81a0c674-764e-4cc6-9635-fb50e91c47d7.png" 
            alt="Escudo de Osasco" 
            className="h-24 w-auto mb-2"
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
