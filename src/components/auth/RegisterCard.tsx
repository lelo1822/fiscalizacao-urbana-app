
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import RegisterForm from "./RegisterForm";

const RegisterCard = () => {
  return (
    <Card className="shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Criar Nova Conta</CardTitle>
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
      </CardFooter>
    </Card>
  );
};

export default RegisterCard;
