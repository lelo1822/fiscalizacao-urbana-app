import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, MapPin } from "lucide-react";
import LocationTracker from "@/components/LocationTracker";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";

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

const RouteHistory = () => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [agentFilter, setAgentFilter] = useState("all");
  const [routeHistory, setRouteHistory] = useState<LocationPoint[]>([]);
  const [routeDays, setRouteDays] = useState<RouteDay[]>([]);
  
  useEffect(() => {
    // In a real app, this would fetch real route history data from a server
    // For the demo, we'll use localStorage data if available, or generate mock data
    
    const storageKey = `locationHistory_${user?.id}`;
    const storedHistory = localStorage.getItem(storageKey);
    
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory);
        setRouteHistory(parsedHistory);
      } catch (err) {
        console.error("Error parsing location history:", err);
      }
    }
    
    // Generate mock route days
    const mockRouteDays: RouteDay[] = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      mockRouteDays.push({
        date: format(date, 'yyyy-MM-dd'),
        points: Math.floor(Math.random() * 50) + 10,
        distance: `${(Math.random() * 10).toFixed(1)} km`,
        duration: `${Math.floor(Math.random() * 5) + 1}h ${Math.floor(Math.random() * 60)}min`,
      });
    }
    
    setRouteDays(mockRouteDays);
  }, [user?.id]);

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
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Visualização da Rota</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center">
                  {/* Mock Map Interface */}
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-primary mx-auto" />
                    <p className="mt-4 text-gray-600">
                      Aqui será exibido o mapa com a rota percorrida na data selecionada.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumo de Atividades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="text-gray-500">Distância Percorrida</div>
                    <div className="text-2xl font-bold">5.3 km</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="text-gray-500">Tempo Ativo</div>
                    <div className="text-2xl font-bold">3h 42min</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="text-gray-500">Ocorrências</div>
                    <div className="text-2xl font-bold">7</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Pontos de Parada</h3>
                  
                  <div className="space-y-3 mt-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="border rounded-md p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">
                              {item === 1 ? "Rua das Flores, 123" : 
                               item === 2 ? "Av. Principal, 456" : 
                               "Praça Central"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item === 1 ? "10:15 - 10:35 (20min)" : 
                               item === 2 ? "11:20 - 11:50 (30min)" : 
                               "14:05 - 14:20 (15min)"}
                            </div>
                          </div>
                          <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
                            {item === 1 ? "Buraco na via" : 
                             item === 2 ? "Poda de árvore" : 
                             "Lâmpada queimada"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
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
                        date && format(date, 'yyyy-MM-dd') === day.date ? "border-primary" : ""
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
