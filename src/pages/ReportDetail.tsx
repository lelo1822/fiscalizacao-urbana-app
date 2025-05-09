
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, FileText, ArrowUp } from "lucide-react";
import LocationTracker from "@/components/LocationTracker";

// Mock report data (in a real app, this would come from an API)
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
    id: "2"
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
  
  // In a real app, you would fetch the report data using the ID
  const report = mockReportData;
  
  // Format date for display
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
          <div className="mt-4 md:mt-0">
            <Button 
              variant="outline"
              onClick={() => navigate(-1)}
              className="border-primary text-primary hover:bg-primary/10"
            >
              <ArrowUp className="mr-2 h-4 w-4 rotate-90" />
              Voltar
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
              {/* Location Information */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Localização</span>
                </div>
                <div>
                  <p>{report.address}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Coordenadas: {report.coordinates.lat.toFixed(6)}, {report.coordinates.lng.toFixed(6)}
                  </p>
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
                
                {/* Status Update Form (in a real app, this would be a functional form) */}
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
      <LocationTracker />
    </Layout>
  );
};

export default ReportDetail;
