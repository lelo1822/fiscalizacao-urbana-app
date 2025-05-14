
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, ArrowUp, User, Phone, Home, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Dados simulados da ocorrência (em um app real, isso viria de uma API)
const mockReportData = {
  id: "1",
  type: "Buraco na via",
  description: "Buraco grande no meio da pista causando risco para veículos que passam no local.",
  address: "Rua das Flores, 123 - Centro",
  coordinates: { lat: -23.55052, lng: -46.633308 },
  date: "2023-05-08T10:30:00",
  status: "Pendente",
  photos: [
    "https://images.unsplash.com/photo-1584263347416-85a696b87e46?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1626255549848-6101ace41b57?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  ],
  agent: {
    name: "Agente Silva",
    id: "2",
    gabineteId: "1"
  },
  complainant: {
    fullName: "Maria da Silva",
    phone: "(11) 98765-4321",
    whatsapp: "(11) 98765-4321",
    address: "Av. Paulista, 1000 - Bela Vista"
  },
  updates: [
    { 
      date: "2023-05-08T10:30:00", 
      text: "Ocorrência registrada", 
      author: "Agente Silva" 
    }
  ]
};

const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Em um app real, você buscaria os dados da ocorrência usando o ID
  const report = mockReportData;
  
  // Verificar se o usuário tem acesso a esta ocorrência
  const hasAccess = user?.gabineteId === report.agent.gabineteId || user?.role === 'admin';
  
  // Formatar data para exibição
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }) + ' às ' + date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!hasAccess) {
    return (
      <Layout>
        <div className="p-4 md:p-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <h2 className="text-xl font-bold text-destructive">Acesso Negado</h2>
                <p className="mt-2">Você não tem permissão para visualizar esta ocorrência.</p>
                <Button 
                  onClick={() => navigate("/dashboard")}
                  className="mt-4"
                >
                  Voltar para o Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Ocorrência #{id}
            </h1>
            <div className="flex items-center mt-1">
              <Badge className={
                report.status === "Pendente" ? "bg-primary" : 
                report.status === "Em andamento" ? "bg-warning" : 
                "bg-success"
              }>
                {report.status}
              </Badge>
              <span className="text-gray-500 mx-2">•</span>
              <span className="text-gray-500 text-sm">{report.type}</span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button 
              variant="outline"
              onClick={() => navigate(-1)}
              className="border-primary text-primary hover:bg-primary/10"
            >
              <ArrowUp className="mr-2 h-4 w-4 rotate-90" />
              Voltar
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/reports")}
            >
              Ver Lista
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Detalhes da Ocorrência</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="occurrence">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="occurrence">Ocorrência</TabsTrigger>
                  <TabsTrigger value="complainant">Dados do Reclamante</TabsTrigger>
                </TabsList>
                
                <TabsContent value="occurrence" className="space-y-6 pt-4">
                  {/* Location Information - sem mapa agora */}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Home className="h-4 w-4 mr-2" />
                      <span>Endereço</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p>{report.address}</p>
                    </div>
                  </div>
                  
                  {/* Date Information */}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Data e Hora</span>
                    </div>
                    <div>
                      <p>{formatDate(report.date)}</p>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <FileText className="h-4 w-4 mr-2" />
                      <span>Descrição</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p>{report.description}</p>
                    </div>
                  </div>
                  
                  {/* Photos */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Fotos</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {report.photos.map((photo, index) => (
                        <div key={index} className="aspect-square rounded-md overflow-hidden border">
                          <img 
                            src={photo} 
                            alt={`Foto ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="complainant" className="space-y-6 pt-4">
                  {/* Complainant Information */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="h-4 w-4 mr-2" />
                        <span>Nome completo</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p>{report.complainant.fullName}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>Telefone</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p>{report.complainant.phone}</p>
                      </div>
                    </div>
                    
                    {report.complainant.whatsapp && (
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="h-4 w-4 mr-2" />
                          <span>WhatsApp</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p>{report.complainant.whatsapp}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Home className="h-4 w-4 mr-2" />
                        <span>Endereço</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p>{report.complainant.address}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {report.updates.map((update, index) => (
                  <div key={index} className="relative pl-6 pb-6">
                    <div className="absolute left-0 top-0 h-full w-px bg-gray-300"></div>
                    <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-primary -ml-1"></div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(update.date)}
                      </p>
                      <p className="font-medium mt-1">{update.text}</p>
                      <p className="text-sm mt-1">Por: {update.author}</p>
                    </div>
                  </div>
                ))}
                
                {/* Status Update Form (em um app real, isso seria um formulário funcional) */}
                <div className="border-t pt-4 mt-6">
                  <h4 className="font-medium mb-3">Adicionar Atualização</h4>
                  <textarea 
                    className="w-full p-2 border rounded-md text-sm mb-3" 
                    rows={3} 
                    placeholder="Adicione um comentário ou atualização..."
                  ></textarea>
                  <div className="flex gap-3 mb-2">
                    <Select defaultValue="pending">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="in_progress">Em andamento</SelectItem>
                        <SelectItem value="resolved">Resolvido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full bg-primary">Atualizar</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ReportDetail;
