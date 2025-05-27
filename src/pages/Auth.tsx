
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import CouncilorSelect from '@/components/auth/CouncilorSelect';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Clock, RefreshCw } from "lucide-react";

const Auth = () => {
  const { signIn, signUp, loading, isAuthenticated } = useSupabaseAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states for login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Form states for signup
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState<'agent' | 'vereador'>('agent');
  const [signupGabinete, setSignupGabinete] = useState('1');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');
    setSuccessMessage('');
    
    const result = await signIn(loginEmail, loginPassword);
    if (!result.success) {
      if (result.error?.message === 'Email not confirmed') {
        setFormError('⚠️ Você precisa confirmar seu email antes de fazer login. Verifique sua caixa de entrada e pasta de spam. Se não recebeu o email, tente fazer um novo cadastro.');
      } else if (result.error?.message === 'Invalid login credentials') {
        setFormError('❌ Email ou senha incorretos. Verifique suas credenciais ou tente fazer um novo cadastro se ainda não tem conta.');
      } else if (result.error?.message?.includes('rate_limit')) {
        setFormError('⏰ Muitas tentativas de login. Aguarde alguns minutos antes de tentar novamente.');
      } else {
        setFormError('🔧 Erro ao fazer login. Tente novamente em alguns minutos ou entre em contato com o suporte.');
      }
    }
    setIsSubmitting(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');
    setSuccessMessage('');
    
    if (!signupGabinete) {
      setFormError('Por favor, selecione um vereador.');
      setIsSubmitting(false);
      return;
    }

    if (signupPassword.length < 6) {
      setFormError('A senha deve ter pelo menos 6 caracteres.');
      setIsSubmitting(false);
      return;
    }

    // Validação de email
    if (!signupEmail.includes('@')) {
      setFormError('Por favor, insira um email válido.');
      setIsSubmitting(false);
      return;
    }
    
    const result = await signUp(signupEmail, signupPassword, signupName, signupRole, signupGabinete);
    if (!result.success) {
      if (result.error?.message?.includes('rate_limit')) {
        setFormError('⏰ Limite de tentativas excedido. Aguarde alguns minutos antes de tentar novamente. Se você já tem uma conta, tente fazer login.');
      } else if (result.error?.message?.includes('already_registered') || result.error?.message?.includes('already been registered')) {
        setFormError('📧 Este email já está cadastrado. Tente fazer login ou use outro email.');
      } else if (result.error?.message?.includes('signup_disabled')) {
        setFormError('🚫 Cadastros temporariamente desabilitados. Tente novamente mais tarde.');
      } else {
        setFormError('❌ Erro ao criar conta. Verifique se o email está correto e tente novamente. Se o problema persistir, use outro email.');
      }
    } else {
      setSuccessMessage('✅ Cadastro realizado com sucesso! Verifique seu email para confirmar a conta antes de fazer login. Pode levar alguns minutos para chegar.');
      // Limpar formulário após sucesso
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
      setSignupGabinete('1');
    }
    setIsSubmitting(false);
  };

  const clearMessages = () => {
    setFormError('');
    setSuccessMessage('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex flex-col items-center justify-center">
              <img 
                src="/lovable-uploads/dce4f081-f924-447d-965b-1668df335311.png" 
                alt="Câmara Municipal de Osasco" 
                className="h-20 w-auto mb-4"
              />
              <CardTitle className="text-2xl text-center">Câmara na Rua</CardTitle>
              <CardDescription className="text-center">
                Sistema de Gestão de Ocorrências
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {formError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formError}</AlertDescription>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2 h-6 px-2"
                  onClick={clearMessages}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Tentar novamente
                </Button>
              </Alert>
            )}
            
            {successMessage && (
              <Alert className="mb-4 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" onClick={clearMessages}>Entrar</TabsTrigger>
                <TabsTrigger value="signup" onClick={clearMessages}>Cadastrar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu-email@exemplo.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
                
                <div className="text-center text-sm text-muted-foreground space-y-2">
                  <p>💡 <strong>Problemas para acessar?</strong></p>
                  <div className="text-xs space-y-1">
                    <p>• Verifique se confirmou seu email na caixa de entrada</p>
                    <p>• Se não tem conta, use a aba "Cadastrar"</p>
                    <p>• Se esqueceu a senha, faça um novo cadastro</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Nome Completo</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="seu-email@exemplo.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Senha</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      minLength={6}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Função</Label>
                    <Select 
                      value={signupRole} 
                      onValueChange={(value: 'agent' | 'vereador') => setSignupRole(value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione sua função" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agent">Assessor</SelectItem>
                        <SelectItem value="vereador">Vereador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <CouncilorSelect 
                    selectedGabineteId={signupGabinete}
                    onChange={setSignupGabinete}
                    formError=""
                  />
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Cadastrando..." : "Cadastrar"}
                  </Button>
                </form>
                
                <Alert className="border-blue-200 bg-blue-50">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-700">
                    <strong>📧 Importante:</strong> Após o cadastro, você receberá um email de confirmação. 
                    Confirme seu email antes de tentar fazer login. O email pode demorar alguns minutos para chegar.
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
