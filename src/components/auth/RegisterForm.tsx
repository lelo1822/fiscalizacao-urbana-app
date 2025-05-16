
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, GABINETES } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface RegisterFormErrors {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  gabinete: string;
}

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register, getGabineteUsers } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"admin" | "agent" | "vereador">("agent");
  const [gabineteId, setGabineteId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<RegisterFormErrors>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gabinete: "",
  });
  
  // Estado para mostrar informação sobre a capacidade do gabinete selecionado
  const [gabineteInfo, setGabineteInfo] = useState<{ vereadores: number, assessores: number } | null>(null);

  // Atualizar informações do gabinete quando um gabinete é selecionado
  const handleGabineteChange = (value: string) => {
    setGabineteId(value);
    // Limpar erro se houver
    if (formErrors.gabinete) {
      setFormErrors(prev => ({ ...prev, gabinete: "" }));
    }
    
    // Obter informações atuais do gabinete
    const info = getGabineteUsers(value);
    setGabineteInfo(info);
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      gabinete: "",
    };

    // Validação do nome
    if (!name.trim()) {
      errors.name = "Nome é obrigatório";
      isValid = false;
    }

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

    // Validação da confirmação de senha
    if (password !== confirmPassword) {
      errors.confirmPassword = "As senhas não coincidem";
      isValid = false;
    }
    
    // Validação do gabinete
    if (!gabineteId) {
      errors.gabinete = "Selecione um gabinete";
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
      const success = await register(name, email, password, role, gabineteId);
      if (success) {
        toast({
          title: "Cadastro realizado com sucesso",
          description: "Você será redirecionado para o dashboard.",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Erro no cadastro",
          description: "Não foi possível realizar o cadastro. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao cadastrar",
        description: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
        variant: "destructive",
      });
      console.error("Erro de cadastro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo</Label>
        <Input
          id="name"
          placeholder="Nome completo"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (formErrors.name) {
              setFormErrors(prev => ({ ...prev, name: "" }));
            }
          }}
          className={formErrors.name ? "border-destructive" : ""}
          disabled={isLoading}
        />
        {formErrors.name && (
          <p className="text-destructive text-xs mt-1">{formErrors.name}</p>
        )}
      </div>
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
          disabled={isLoading}
        />
        {formErrors.email && (
          <p className="text-destructive text-xs mt-1">{formErrors.email}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
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
          disabled={isLoading}
          minLength={6}
        />
        {formErrors.password && (
          <p className="text-destructive text-xs mt-1">{formErrors.password}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar Senha</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (formErrors.confirmPassword) {
              setFormErrors(prev => ({ ...prev, confirmPassword: "" }));
            }
          }}
          className={formErrors.confirmPassword ? "border-destructive" : ""}
          disabled={isLoading}
        />
        {formErrors.confirmPassword && (
          <p className="text-destructive text-xs mt-1">{formErrors.confirmPassword}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Função</Label>
        <Select 
          value={role} 
          onValueChange={(value) => setRole(value as "admin" | "agent" | "vereador")}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma função" />
          </SelectTrigger>
          <SelectContent position="popper" className="bg-white">
            <SelectItem value="admin">Administrador</SelectItem>
            <SelectItem value="agent">Assessor</SelectItem>
            <SelectItem value="vereador">Vereador</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="gabinete">Gabinete</Label>
        <Select 
          value={gabineteId} 
          onValueChange={handleGabineteChange}
          disabled={isLoading}
        >
          <SelectTrigger className={formErrors.gabinete ? "border-destructive" : ""}>
            <SelectValue placeholder="Selecione um gabinete" />
          </SelectTrigger>
          <SelectContent position="popper" className="bg-white">
            {GABINETES.map(gabinete => (
              <SelectItem key={gabinete.id} value={gabinete.id}>
                {gabinete.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formErrors.gabinete && (
          <p className="text-destructive text-xs mt-1">{formErrors.gabinete}</p>
        )}
        
        {/* Informações sobre a capacidade do gabinete */}
        {gabineteInfo && (
          <div className="mt-2 text-xs text-muted-foreground">
            <p>Vereadores: {gabineteInfo.vereadores}/1</p>
            <p>Assessores: {gabineteInfo.assessores}/8</p>
            {role === "vereador" && gabineteInfo.vereadores >= 1 && (
              <p className="text-destructive">Este gabinete já possui um vereador cadastrado</p>
            )}
            {role === "agent" && gabineteInfo.assessores >= 8 && (
              <p className="text-destructive">Este gabinete já atingiu o limite de assessores</p>
            )}
          </div>
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
            Cadastrando...
          </span>
        ) : "Cadastrar"}
      </Button>
    </form>
  );
};

export default RegisterForm;
