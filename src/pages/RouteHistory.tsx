import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, addDays, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, MapPin, Navigation, Clock, Activity, AlertCircle } from "lucide-react";
import LocationTracker from "@/components/LocationTracker";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import RouteMap from "@/components/RouteMap";
import { toast } from "@/components/ui/use-toast";

interface LocationPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface RouteDay {
  date: string;
  points: number;
  distance: string;
  duration: string;
}

interface StopPoint {
  id: number;
  location: string;
  timeRange: string;
  duration: string;
  type: string;
}

const RouteHistory = () => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [agentFilter, setAgentFilter] = useState("all");
  const [routeHistory, setRouteHistory] = useState<LocationPoint[]>([]);
  const [routeDays, setRouteDays] = useState<RouteDay[]>([]);
  const [selectedRoutePoints, setSelectedRoutePoints] = useState<LocationPoint[]>([]);
  const [stopPoints, setStopPoints] = useState<StopPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Carregar histórico de rotas quando a data mudar
  useEffect(() => {
    if (!date) return;
    
    const loadRouteData = async () => {
      setIsLoading(true);
      
      try {
        // Em um app real, isso buscaria dados do servidor
        // Para demonstração, usaremos dados simulados
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulando delay de rede
        
        // Gerar pontos de rota simulados baseados na data
        const seed = date.getDate() + date.getMonth();
        const pointCount = 80 + seed % 40; // Entre 80 e 120 pontos
        
        const simulatedPoints: LocationPoint[] = [];
        const baseTimestamp = new Date(date);
        baseTimestamp.setHours(8, 0, 0, 0); // Começar às 8h
        
        // Base coordinates (São Paulo)
        const baseLat = -23.55052;
        const baseLng = -46.63308;
        
        for (let i = 0; i < pointCount; i++) {
          // Criar uma trajetória com alguma variação
          const progress = i / (pointCount - 1);
          const radius = 0.02 * Math.sin(progress * Math.PI); // Variação máxima de 0.02 graus
          const angle = progress * 12 * Math.PI + seed; // Ângulo variando com base na data
          
          const point = {
            latitude: baseLat + radius * Math.cos(angle) + (Math.random() - 0.5) * 0.001,
            longitude: baseLng + radius * Math.sin(angle) + (Math.random() - 0.5) * 0.001,
            timestamp: baseTimestamp.getTime() + i * 2 * 60 * 1000 // 2 minutos entre pontos
          };
          
          simulatedPoints.push(point);
        }
        
        // Gerar pontos de parada simulados
        const stops: StopPoint[] = [
          {
            id: 1,
            location: "Rua das Flores, 123",
            timeRange: "10:15 - 10:35",
            duration: "20min",
            type: "Buraco na via"
          },
          {
            id: 2,
            location: "Av. Principal, 456",
            timeRange: "11:20 - 11:50",
            duration: "30min",
            type: "Poda de árvore"
          },
          {
            id: 3,
            location: "Praça Central",
            timeRange: "14:05 - 14:20",
            duration: "15min",
            type: "Lâmpada queimada"
          }
        ];
        
        setSelectedRoutePoints(simulatedPoints);
        setStopPoints(stops);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        toast({
          title: "Erro",
          description: "Erro ao carregar dados da rota",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRouteData();
  }, [date]);
  
  useEffect(() => {
    // Carregar histórico geral de dias
    const storageKey = `locationHistory_${user?.id || 'anonymous'}`;
    const storedHistory = localStorage.getItem(storageKey);
    
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory);
        setRouteHistory(parsedHistory);
      } catch (err) {
        console.error("Erro ao analisar histórico de localização:", err);
      }
    }
    
    // Gerar dias de rota simulados
    const mockRouteDays: RouteDay[] = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const routeDate = subDays(today, i);
      
      // Usar o dia como semente para ter valores consistentes mas variados
      const seed = routeDate.getDate() + routeDate.getMonth();
      const distance = (3 + (seed % 8) + Math.random() * 2).toFixed(1);
      const hours = 1 + (seed % 5);
      const minutes = seed % 60;
      
      mockRouteDays.push({
        date: format(routeDate, 'yyyy-MM-dd'),
        points: Math.floor(30 + seed % 50),
        distance: `${distance} km`,
        duration: `${hours}h ${minutes}min`,
      });
    }
    
    setRouteDays(mockRouteDays);
  }, [user?.id]);

  // Calcular métricas da rota selecionada
  const getRouteSummary = () => {
    if (selectedRoutePoints.length < 2) {
      return { distance: "0 km", duration: "0h 00min", occurrences: 0 };
    }
    
    // Calcular distância total (em um app real, seria mais preciso)
    const distanceInKm = (selectedRoutePoints.length * 0.05).toFixed(1);
    
    // Calcular duração
    const startTime = new Date(selectedRoutePoints[0].timestamp);
    const endTime = new Date(selectedRoutePoints[selectedRoutePoints.length - 1].timestamp);
    const durationMs = endTime.getTime() - startTime.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return {
      distance: `${distanceInKm} km`,
      duration: `${hours}h ${minutes}min`,
      occurrences: stopPoints.length
    };
  };
  
  const summary = getRouteSummary();

  return (
    <Layout>
      <div className="p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Histórico de Rotas
            </h1>
            <p className="text-gray-500">
              Visualize o registro de deslocamentos dos agentes
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="agentFilter">Agente:</Label>
              <Select value={agentFilter} onValueChange={setAgentFilter}>
                <SelectTrigger id="agentFilter" className="w-[180px]">
                  <SelectValue placeholder="Todos os agentes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os agentes</SelectItem>
                  <SelectItem value="current">Meu histórico</SelectItem>
                  <SelectItem value="agent1">Agente Silva</SelectItem>
                  <SelectItem value="agent2">Agente Oliveira</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[180px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    locale={ptBR}
                    className={cn("p-3 pointer-events-auto")}
                    disabled={(date) => date > new Date() || date < subDays(new Date(), 30)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Visualização da Rota</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {date && format(date, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="w-full h-[400px] bg-gray-50 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <p className="mt-2 text-gray-500">Carregando rota...</p>
                    </div>
                  </div>
                ) : selectedRoutePoints.length > 0 ? (
                  <RouteMap 
                    routePoints={selectedRoutePoints} 
                    height="400px"
                    showMarkers={true}
                  />
                ) : (
                  <div className="w-full h-[400px] bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-16 w-16 text-primary mx-auto" />
                      <p className="mt-4 text-gray-600">
                        Selecione uma data para visualizar a rota percorrida.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumo de Atividades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Navigation className="h-4 w-4" />
                      <span>Distância Percorrida</span>
                    </div>
                    <div className="text-2xl font-bold mt-1">{summary.distance}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>Tempo Ativo</span>
                    </div>
                    <div className="text-2xl font-bold mt-1">{summary.duration}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Activity className="h-4 w-4" />
                      <span>Ocorrências</span>
                    </div>
                    <div className="text-2xl font-bold mt-1">{summary.occurrences}</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Pontos de Parada</h3>
                    <Badge variant="outline" className="text-xs">
                      {stopPoints.length} paradas
                    </Badge>
                  </div>
                  
                  {stopPoints.length > 0 ? (
                    <div className="space-y-3">
                      {stopPoints.map((stop) => (
                        <div key={stop.id} className="border rounded-md p-3 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">
                                {stop.location}
                              </div>
                              <div className="text-sm text-gray-500">
                                {stop.timeRange} ({stop.duration})
                              </div>
                            </div>
                            <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
                              {stop.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center border rounded-md border-dashed">
                      <AlertCircle className="h-12 w-12 text-muted-foreground opacity-20" />
                      <p className="mt-2 text-muted-foreground">Nenhuma parada registrada nesta data</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Dias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {routeDays.map((day, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      className={cn(
                        "w-full justify-start text-left h-auto py-3 px-4 font-normal",
                        date && format(date, 'yyyy-MM-dd') === day.date ? "border-primary bg-primary/5" : ""
                      )}
                      onClick={() => setDate(new Date(day.date))}
                    >
                      <div className="w-full">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">
                            {format(new Date(day.date), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                          </span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                            {day.points} pontos
                          </span>
                        </div>
                        <div className="flex justify-between mt-2 text-sm text-gray-500">
                          <span>{day.distance}</span>
                          <span>{day.duration}</span>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
                
                <Button 
                  className="w-full mt-4" 
                  variant="outline"
                >
                  Ver histórico completo
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <LocationTracker />
    </Layout>
  );
};

export default RouteHistory;
