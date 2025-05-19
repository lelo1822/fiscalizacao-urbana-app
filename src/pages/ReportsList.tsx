
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { getFilteredReports } from "@/services/reportService";
import { Report } from "@/types/dashboard";
import { usePagination } from "@/hooks/usePagination";
import { useIsMobile } from "@/hooks/use-mobile";

// Component imports
import ReportsHeader from "@/components/reports/ReportsHeader";
import ReportsFilters from "@/components/reports/ReportsFilters";
import ReportsTable from "@/components/reports/ReportsTable";
import ReportsEmptyState from "@/components/reports/ReportsEmptyState";
import ReportsLoadingState from "@/components/reports/ReportsLoadingState";
import ReportsPagination from "@/components/reports/ReportsPagination";
import ReportsErrorState from "@/components/reports/ReportsErrorState";

const ReportsList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateRangeStart, setDateRangeStart] = useState<Date | undefined>();
  const [dateRangeEnd, setDateRangeEnd] = useState<Date | undefined>();
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page

  // Pagination hook
  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedReports,
    setPage,
    startIndex,
    endIndex
  } = usePagination({
    items: filteredReports,
    itemsPerPage,
    initialPage: 1
  });

  // Carregar ocorrências
  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const gabineteId = user?.gabineteId;
        const allReports = getFilteredReports("all");
        
        const userReports = gabineteId 
          ? allReports.filter(report => report.agent?.gabineteId === gabineteId)
          : allReports;
          
        setReports(userReports);
        setFilteredReports(userReports);
      } catch (error) {
        console.error("Erro ao carregar ocorrências:", error);
        setError("Não foi possível carregar as ocorrências. Verifique sua conexão e tente novamente.");
        toast({
          title: "Erro",
          description: "Não foi possível carregar as ocorrências.",
          variant: "destructive",
        });
      } finally {
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
    // Reset to first page when filters change
    setPage(1);
  }, [reports, searchQuery, statusFilter, typeFilter, dateRangeStart, dateRangeEnd]);

  // Handle date range filter changes
  const handleDateRangeChange = (startDate: Date | undefined, endDate: Date | undefined) => {
    setDateRangeStart(startDate);
    setDateRangeEnd(endDate);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (count: number) => {
    setItemsPerPage(count);
    setPage(1); // Reset to first page when changing items per page
  };

  // Handle view details click
  const handleViewDetails = (reportId: number) => {
    navigate(`/report/${reportId}`);
  };

  // Retry loading reports
  const handleRetry = () => {
    // Reset error state and trigger a reload by refreshing the dependency
    setReports([]);
    setError(null);
    // Forced reload of the data
    setTimeout(() => {
      setIsLoading(true);
    }, 100);
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
            ) : error ? (
              <ReportsErrorState 
                message={error} 
                onRetry={handleRetry}
              />
            ) : filteredReports.length > 0 ? (
              <>
                <ReportsTable 
                  reports={paginatedReports}
                  onViewDetails={handleViewDetails}
                  currentPage={currentPage}
                  totalItems={filteredReports.length}
                  startIndex={startIndex}
                  endIndex={endIndex}
                />
                
                <div className={`${isMobile ? 'flex flex-col space-y-4' : 'flex justify-between items-center'} mt-4`}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Itens por página:</span>
                    <select 
                      className="text-sm border rounded px-2 py-1"
                      value={itemsPerPage}
                      onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                  
                  <ReportsPagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </div>
              </>
            ) : (
              <ReportsEmptyState />
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ReportsList;
