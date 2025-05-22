
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    let isValid = true;
    const errors = { email: "", password: "" };

    // Validação do email
    if (!email) {
      errors.email = "Email é obrigatório";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email inválido";
      isValid = false;
    }

    // Validação da senha
    if (!password) {
      errors.password = "Senha é obrigatória";
      isValid = false;
    } else if (password.length < 6) {
      errors.password = "Senha deve ter no mínimo 6 caracteres";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulário antes de submeter
    if (!validateForm()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os campos destacados.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Login realizado com sucesso",
          description: "Você será redirecionado para o dashboard.",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Erro de autenticação",
          description: "Credenciais inválidas. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
        variant: "destructive",
      });
      console.error("Erro de login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu-email@prefeitura.gov.br"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (formErrors.email) {
              setFormErrors(prev => ({ ...prev, email: "" }));
            }
          }}
          className={formErrors.email ? "border-destructive" : ""}
          aria-invalid={!!formErrors.email}
          disabled={isLoading}
        />
        {formErrors.email && (
          <p className="text-destructive text-xs mt-1">{formErrors.email}</p>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Senha</Label>
          <Button 
            variant="link" 
            size="sm" 
            className="p-0 h-auto text-xs text-primary hover:text-primary/80"
            type="button"
            onClick={() => {
              toast({
                title: "Recuperação de senha",
                description: "Entre em contato com o administrador do sistema para recuperar sua senha.",
              });
            }}
          >
            Esqueceu a senha?
          </Button>
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (formErrors.password) {
              setFormErrors(prev => ({ ...prev, password: "" }));
            }
          }}
          className={formErrors.password ? "border-destructive" : ""}
          aria-invalid={!!formErrors.password}
          disabled={isLoading}
        />
        {formErrors.password && (
          <p className="text-destructive text-xs mt-1">{formErrors.password}</p>
        )}
      </div>
      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90 transition-colors" 
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-1">
            <span className="h-4 w-4 border-2 border-white border-opacity-25 border-t-white rounded-full animate-spin"></span>
            Autenticando...
          </span>
        ) : "Entrar"}
      </Button>
    </form>
  );
};

export default LoginForm;
