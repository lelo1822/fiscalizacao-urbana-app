
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Search, FileText, Filter } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { getFilteredReports } from "@/services/reportService";
import ExcelExportButton from "@/components/reports/ExcelExportButton";
import type { Report } from "@/types/dashboard";

const ReportsList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Carregar ocorrências (simulado por enquanto)
  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Em um caso real, filtraríamos por gabineteId do usuário
        const gabineteId = user?.gabineteId;
        
        // Simulando a obtenção de dados filtrados por gabinete
        const allReports = getFilteredReports("all");
        
        // Filtrar ocorrências pelo gabineteId do usuário (em um caso real)
        const userReports = gabineteId 
          ? allReports.filter(report => report.agent?.gabineteId === gabineteId)
          : allReports; // Admin vê tudo
          
        setReports(userReports);
        setFilteredReports(userReports);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao carregar ocorrências:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as ocorrências.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [user?.gabineteId]);

  // Extrair tipos únicos para o filtro
  const uniqueTypes = [...new Set(reports.map(report => report.type))];

  // Aplicar filtros e pesquisa
  useEffect(() => {
    let result = [...reports];
    
    // Filtrar por status
    if (statusFilter !== "all") {
      result = result.filter(report => {
        if (statusFilter === "pending") return report.status === "Pendente";
        if (statusFilter === "in_progress") return report.status === "Em andamento";
        if (statusFilter === "resolved") return report.status === "Resolvido";
        return true;
      });
    }
    
    // Filtrar por tipo
    if (typeFilter !== "all") {
      result = result.filter(report => report.type === typeFilter);
    }
    
    // Pesquisa
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        report => 
          report.description?.toLowerCase().includes(query) ||
          report.address?.toLowerCase().includes(query) ||
          report.type?.toLowerCase().includes(query) ||
          report.complainant?.fullName?.toLowerCase().includes(query) ||
          report.complainant?.phone?.toLowerCase().includes(query) ||
          report.id.toString().includes(query)
      );
    }
    
    setFilteredReports(result);
  }, [reports, searchQuery, statusFilter, typeFilter]);

  // Manipular clique para ver detalhes
  const handleViewDetails = (reportId: number) => {
    navigate(`/report/${reportId}`);
  };

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Lista de Ocorrências
            </h1>
            <p className="text-gray-500">
              {user?.gabineteId 
                ? `Ocorrências do Gabinete ${user.gabineteId}` 
                : "Todas as ocorrências"
              }
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/report/new')}
            >
              <FileText className="mr-2 h-4 w-4" />
              Nova Ocorrência
            </Button>
            <ExcelExportButton 
              reports={filteredReports} 
              fileName={`ocorrencias_gabinete_${user?.gabineteId || 'todos'}`}
              isLoading={isLoading}
            />
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Ocorrências Registradas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar ocorrências..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-40">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="pending">Pendentes</SelectItem>
                      <SelectItem value="in_progress">Em andamento</SelectItem>
                      <SelectItem value="resolved">Resolvidas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-48">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os tipos</SelectItem>
                      {uniqueTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {isLoading ? (
              <div className="py-8 flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : filteredReports.length > 0 ? (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Endereço</TableHead>
                      <TableHead className="hidden md:table-cell">Reclamante</TableHead>
                      <TableHead className="hidden md:table-cell">Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.id}</TableCell>
                        <TableCell>{report.type}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {report.address}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {report.complainant?.fullName || "Não informado"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {formatDate(report.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            report.status === "Pendente" ? "bg-blue-500" : 
                            report.status === "Em andamento" ? "bg-amber-500" : 
                            "bg-green-500"
                          }>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(report.id)}
                          >
                            Ver
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">
                  Nenhuma ocorrência encontrada.
                </p>
              </div>
            )}
            
            <div className="mt-4 text-sm text-muted-foreground">
              Total: {filteredReports.length} ocorrência(s)
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ReportsList;
