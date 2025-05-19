
import { useState, useEffect } from "react";
import { getFilteredReports } from "@/services/reportService";
import { Report } from "@/types/dashboard";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface ReportsFiltersState {
  searchQuery: string;
  statusFilter: string;
  typeFilter: string;
  dateRangeStart: Date | undefined;
  dateRangeEnd: Date | undefined;
}

export const useReportsData = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [filters, setFilters] = useState<ReportsFiltersState>({
    searchQuery: "",
    statusFilter: "all",
    typeFilter: "all",
    dateRangeStart: undefined,
    dateRangeEnd: undefined
  });

  // Fetch initial reports
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

  // Apply filters and search
  useEffect(() => {
    let result = [...reports];
    const { searchQuery, statusFilter, typeFilter, dateRangeStart, dateRangeEnd } = filters;
    
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
  }, [reports, filters]);

  // Extract unique types for filter
  const uniqueTypes = [...new Set(reports.map(report => report.type))];

  // Filter update handlers
  const updateSearchQuery = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const updateStatusFilter = (status: string) => {
    setFilters(prev => ({ ...prev, statusFilter: status }));
  };

  const updateTypeFilter = (type: string) => {
    setFilters(prev => ({ ...prev, typeFilter: type }));
  };

  const updateDateRange = (startDate: Date | undefined, endDate: Date | undefined) => {
    setFilters(prev => ({ 
      ...prev, 
      dateRangeStart: startDate, 
      dateRangeEnd: endDate 
    }));
  };

  // Retry loading reports
  const handleRetry = () => {
    setReports([]);
    setError(null);
    setIsLoading(true);
  };

  return {
    reports: filteredReports,
    isLoading,
    error,
    uniqueTypes,
    filters,
    updateSearchQuery,
    updateStatusFilter,
    updateTypeFilter,
    updateDateRange,
    handleRetry
  };
};
