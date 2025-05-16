
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { getFilteredReports } from "@/services/reportService";
import { Report } from "@/types/dashboard";

// New component imports
import ReportsHeader from "@/components/reports/ReportsHeader";
import ReportsFilters from "@/components/reports/ReportsFilters";
import ReportsTable from "@/components/reports/ReportsTable";
import ReportsEmptyState from "@/components/reports/ReportsEmptyState";
import ReportsLoadingState from "@/components/reports/ReportsLoadingState";

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

  return (
    <Layout>
      <div className="p-4 md:p-8">
        <ReportsHeader 
          gabineteId={user?.gabineteId}
          reports={filteredReports}
          isLoading={isLoading}
        />

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Ocorrências Registradas</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportsFilters
              uniqueTypes={uniqueTypes}
              onSearchChange={setSearchQuery}
              onStatusFilterChange={setStatusFilter}
              onTypeFilterChange={setTypeFilter}
            />
            
            {isLoading ? (
              <ReportsLoadingState />
            ) : filteredReports.length > 0 ? (
              <ReportsTable 
                reports={filteredReports} 
                onViewDetails={handleViewDetails}
              />
            ) : (
              <ReportsEmptyState />
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
