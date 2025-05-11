
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LocationTracker from "@/components/LocationTracker";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowUp, ArrowDown, Camera, MapPin, FileText, BarChart3, AlertCircle } from "lucide-react";
import LeafletMap from "@/components/LeafletMap";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock data para estatísticas do dashboard
const stats = [
  { label: "Ocorrências Total", value: 128, trend: "up", percent: 12 },
  { label: "Resolvidas", value: 87, trend: "up", percent: 8 },
  { label: "Em andamento", value: 41, trend: "down", percent: 5 },
  { label: "Últimas 24h", value: 12, trend: "up", percent: 50 },
];

// Mock data para relatórios recentes
const recentReports = [
  { 
    id: 1, 
    type: "Buraco na via", 
    address: "Rua das Flores, 123", 
    date: "2023-05-08", 
    status: "Pendente",
    priority: "high",
    position: [-23.55152, -46.633408] as [number, number],
  },
  { 
    id: 2, 
    type: "Árvore caída", 
    address: "Av. Principal, 456", 
    date: "2023-05-07", 
    status: "Em análise",
    priority: "medium",
    position: [-23.54550, -46.638100] as [number, number],
  },
  { 
    id: 3, 
    type: "Lâmpada queimada", 
    address: "Praça Central", 
    date: "2023-05-06", 
    status: "Resolvido",
    priority: "low",
    position: [-23.56052, -46.629708] as [number, number],
  },
  { 
    id: 4, 
    type: "Lixo acumulado", 
    address: "Rua Lateral, 789", 
    date: "2023-05-05", 
    status: "Resolvido",
    priority: "medium",
    position: [-23.55552, -46.641308] as [number, number],
  },
];

// Categorias para relatório rápido
const reportCategories = [
  { id: 1, name: "Buraco na via", icon: "🚧" },
  { id: 2, name: "Poda de árvore", icon: "🌳" },
  { id: 3, name: "Lâmpada queimada", icon: "💡" },
  { id: 4, name: "Lixo/Entulho", icon: "🗑️" },
  { id: 5, name: "Esgoto/Vazamento", icon: "💧" },
  { id: 6, name: "Sinalização", icon: "🚦" },
];

// Mock data para tarefas do dia
const dailyTasks = [
  { id: 1, title: "Inspecionar obras na Av. Brasil", completed: false, time: "09:00" },
  { id: 2, title: "Verificar reclamações de ruído", completed: true, time: "11:30" },
  { id: 3, title: "Reunião com secretaria", completed: false, time: "14:00" },
  { id: 4, title: "Enviar relatório diário", completed: false, time: "17:00" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [todayDate, setTodayDate] = useState("");
  const [nearbyIssues, setNearbyIssues] = useState<any[]>([]);
  const [tasks, setTasks] = useState(dailyTasks);
  const [weatherInfo, setWeatherInfo] = useState<{ temp: number; condition: string; icon: string } | null>(null);
  
  // Formatar data atual
  useEffect(() => {
    const today = new Date();
    setTodayDate(
      format(today, "EEEE, d 'de' MMMM", { locale: ptBR })
    );
  }, []);
  
  // Simular obtenção da posição do usuário
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserPosition([latitude, longitude]);
          
          // Mock: Encontrar ocorrências próximas (simulação)
          const mockNearby = recentReports
            .filter(issue => Math.random() > 0.5) // Simulando distância
            .slice(0, 2);
          setNearbyIssues(mockNearby);
        },
        (error) => {
          console.error("Erro ao obter localização:", error);
        }
      );
    }
    
    // Mock do clima (numa aplicação real, usaríamos uma API)
    setWeatherInfo({
      temp: 24,
      condition: "Parcialmente nublado",
      icon: "⛅"
    });
  }, []);

  // Marcar tarefa como concluída
  const toggleTaskCompleted = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  // Preparar marcadores para o mapa
  const mapMarkers = recentReports.map(report => ({
    id: report.id,
    position: report.position,
    title: report.address,
    type: report.type,
    status: report.status === "Pendente" ? "pending" : 
           report.status === "Em análise" ? "in_progress" : "resolved" as any,
    priority: report.priority as any
  }));

  return (
    <Layout>
      <div className="p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Olá, {user?.name}
            </h1>
            <p className="text-gray-500">
              {todayDate} • {weatherInfo?.temp}°C {weatherInfo?.icon} {weatherInfo?.condition}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button 
              onClick={() => navigate('/report/new')}
              className="bg-success hover:bg-success/90"
            >
              <Camera className="mr-2 h-4 w-4" />
              Nova Ocorrência
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/map')}
              className="border-primary text-primary hover:bg-primary/10"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Ver Mapa
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                  <div className={`flex items-center ${
                    stat.trend === 'up' ? 'text-success' : 'text-destructive'
                  }`}>
                    {stat.trend === 'up' ? (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    )}
                    <span className="text-xs font-medium">{stat.percent}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Mapa de ocorrências */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle>Mapa de Ocorrências</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <LeafletMap 
                height="320px"
                markers={mapMarkers}
                showUserLocation={true}
                onMarkerClick={(marker) => navigate(`/report/${marker.id}`)}
                center={userPosition || [-23.55052, -46.633308]}
              />
            </CardContent>
          </Card>
          
          {/* Tarefas do dia */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Tarefas do Dia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`flex items-center justify-between p-3 border rounded-md ${
                      task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input 
                        type="checkbox" 
                        checked={task.completed} 
                        onChange={() => toggleTaskCompleted(task.id)} 
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <div>
                        <p className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-500">{task.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {tasks.filter(t => !t.completed).length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-4">
                    Todas as tarefas foram concluídas! 🎉
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ocorrências Próximas */}
        {nearbyIssues.length > 0 && (
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 text-warning mr-2" />
                Ocorrências Próximas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nearbyIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className="p-4 border rounded-md bg-amber-50 border-amber-200 flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-medium">{issue.type}</h4>
                      <p className="text-sm text-muted-foreground">{issue.address}</p>
                      <div className="mt-1">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          issue.status === "Resolvido" ? "bg-success/20 text-success" : 
                          issue.status === "Em análise" ? "bg-warning/20 text-warning" :
                          "bg-secondary/20 text-secondary"
                        }`}>
                          {issue.status}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/report/${issue.id}`)}>
                      Ver Detalhes
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Report Categories */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Registrar ocorrência rápida</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {reportCategories.map((category) => (
                <Button
                  key={category.id}
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center justify-center hover:border-primary hover:text-primary"
                  onClick={() => navigate('/report/new', { state: { category: category.name } })}
                >
                  <span className="text-2xl mb-2">{category.icon}</span>
                  <span className="text-sm text-center">{category.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Ocorrências Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-3 px-2">Tipo</th>
                    <th className="py-3 px-2">Endereço</th>
                    <th className="py-3 px-2">Data</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReports.map((report) => (
                    <tr key={report.id} className="border-b">
                      <td className="py-3 px-2">{report.type}</td>
                      <td className="py-3 px-2">{report.address}</td>
                      <td className="py-3 px-2">{report.date}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          report.status === "Resolvido" ? "bg-success/20 text-success" : 
                          report.status === "Em análise" ? "bg-warning/20 text-warning" :
                          "bg-secondary/20 text-secondary"
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="h-8 px-2 text-primary"
                          onClick={() => navigate(`/report/${report.id}`)}
                        >
                          Ver detalhes
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <Button 
                variant="outline"
                onClick={() => navigate('/map')}
                className="border-primary text-primary hover:bg-primary/10"
              >
                <FileText className="mr-2 h-4 w-4" />
                Ver todos os relatórios
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <LocationTracker />
    </Layout>
  );
};

export default Dashboard;
