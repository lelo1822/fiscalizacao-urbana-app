
import Layout from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LocationTracker from "@/components/LocationTracker";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Camera, MapPin, FileText, BarChart3 } from "lucide-react";

// Mock data for dashboard statistics
const stats = [
  { label: "Ocorrências Total", value: 128 },
  { label: "Resolvidas", value: 87 },
  { label: "Em andamento", value: 41 },
  { label: "Última 24h", value: 12 },
];

// Mock data for recent reports
const recentReports = [
  { id: 1, type: "Buraco na via", address: "Rua das Flores, 123", date: "2023-05-08", status: "Pendente" },
  { id: 2, type: "Árvore caída", address: "Av. Principal, 456", date: "2023-05-07", status: "Em análise" },
  { id: 3, type: "Lâmpada queimada", address: "Praça Central", date: "2023-05-06", status: "Resolvido" },
  { id: 4, type: "Lixo acumulado", address: "Rua Lateral, 789", date: "2023-05-05", status: "Resolvido" },
];

// Categories for quick report
const reportCategories = [
  { id: 1, name: "Buraco na via", icon: "🚧" },
  { id: 2, name: "Poda de árvore", icon: "🌳" },
  { id: 3, name: "Lâmpada queimada", icon: "💡" },
  { id: 4, name: "Lixo/Entulho", icon: "🗑️" },
  { id: 5, name: "Esgoto/Vazamento", icon: "💧" },
  { id: 6, name: "Sinalização", icon: "🚦" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Layout>
      <div className="p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Olá, {user?.name}
            </h1>
            <p className="text-gray-500">
              Bem-vindo ao painel de controle
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
                <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

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
