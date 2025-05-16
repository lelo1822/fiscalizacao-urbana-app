
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { getFilteredReports } from "@/services/reportService";
import { Report } from "@/types/dashboard";

// Component imports
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
  const [dateRangeStart, setDateRangeStart] = useState<Date | undefined>();
  const [dateRangeEnd, setDateRangeEnd] = useState<Date | undefined>();

  // Carregar ocorrências
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const gabineteId = user?.gabineteId;
        const allReports = getFilteredReports("all");
        
        const userReports = gabineteId 
          ? allReports.filter(report => report.agent?.gabineteId === gabineteId)
          : allReports;
          
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

  // Extract unique types for filter
  const uniqueTypes = [...new Set(reports.map(report => report.type))];

  // Apply filters and search
  useEffect(() => {
    let result = [...reports];
    
    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter(report => {
        if (statusFilter === "pending") return report.status === "Pendente";
        if (statusFilter === "in_progress") return report.status === "Em andamento";
        if (statusFilter === "resolved") return report.status === "Resolvido";
        return true;
      });
    }
    
    // Filter by type
    if (typeFilter !== "all") {
      result = result.filter(report => report.type === typeFilter);
    }
    
    // Filter by date range
    if (dateRangeStart || dateRangeEnd) {
      result = result.filter(report => {
        const reportDate = new Date(report.createdAt);
        
        // If only start date is provided
        if (dateRangeStart && !dateRangeEnd) {
          return reportDate >= dateRangeStart;
        }
        
        // If only end date is provided
        if (!dateRangeStart && dateRangeEnd) {
          // Add one day to include the end date fully
          const endDatePlusOne = new Date(dateRangeEnd);
          endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
          return reportDate < endDatePlusOne;
        }
        
        // If both dates are provided
        if (dateRangeStart && dateRangeEnd) {
          // Add one day to include the end date fully
          const endDatePlusOne = new Date(dateRangeEnd);
          endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
          return reportDate >= dateRangeStart && reportDate < endDatePlusOne;
        }
        
        return true;
      });
    }
    
    // Search
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
  }, [reports, searchQuery, statusFilter, typeFilter, dateRangeStart, dateRangeEnd]);

  // Handle date range filter changes
  const handleDateRangeChange = (startDate: Date | undefined, endDate: Date | undefined) => {
    setDateRangeStart(startDate);
    setDateRangeEnd(endDate);
  };

  // Handle view details click
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
              onDateRangeChange={handleDateRangeChange}
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
