
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Custom hook for reports data and filtering
import { useReportsData } from "@/hooks/useReportsData";

// Component imports
import ReportsHeader from "@/components/reports/ReportsHeader";
import ReportsFilters from "@/components/reports/ReportsFilters";
import ReportsContent from "@/components/reports/ReportsContent";

const ReportsList = () => {
  const navigate = useNavigate();
  
  const { 
    reports, 
    isLoading, 
    error, 
    uniqueTypes, 
    updateSearchQuery,
    updateStatusFilter,
    updateTypeFilter,
    updateDateRange,
    handleRetry,
    filters
  } = useReportsData();

  // Check if any filter is active
  const isFilterActive = 
    filters.searchQuery !== "" || 
    filters.statusFilter !== "all" || 
    filters.typeFilter !== "all" || 
    filters.dateRangeStart !== undefined || 
    filters.dateRangeEnd !== undefined;

  return (
    <Layout>
      <div className="p-4 md:p-8">
        <ReportsHeader 
          gabineteId={undefined}
          reports={reports}
          isLoading={isLoading}
        />

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Ocorrências Registradas</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportsFilters
              uniqueTypes={uniqueTypes}
              onSearchChange={updateSearchQuery}
              onStatusFilterChange={updateStatusFilter}
              onTypeFilterChange={updateTypeFilter}
              onDateRangeChange={updateDateRange}
            />
            
            <ReportsContent 
              reports={reports}
              isLoading={isLoading}
              error={error}
              onRetry={handleRetry}
              filterActive={isFilterActive}
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ReportsList;
