
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePagination } from "@/hooks/usePagination";
import { Report } from "@/types/dashboard";
import { useIsMobile } from "@/hooks/use-mobile";

// Component imports
import ReportsTable from "@/components/reports/ReportsTable";
import ReportsEmptyState from "@/components/reports/ReportsEmptyState";
import ReportsLoadingState from "@/components/reports/ReportsLoadingState";
import ReportsPagination from "@/components/reports/ReportsPagination";
import ReportsErrorState from "@/components/reports/ReportsErrorState";

interface ReportsContentProps {
  reports: Report[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  filterActive?: boolean;
}

const ReportsContent: React.FC<ReportsContentProps> = ({
  reports,
  isLoading,
  error,
  onRetry,
  filterActive = false
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Pagination hook
  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedReports,
    setPage,
    startIndex,
    endIndex
  } = usePagination({
    items: reports,
    itemsPerPage,
    initialPage: 1
  });

  // Handle items per page change
  const handleItemsPerPageChange = (count: number) => {
    setItemsPerPage(count);
    setPage(1); // Reset to first page when changing items per page
  };

  // Handle view details click
  const handleViewDetails = (reportId: number) => {
    navigate(`/report/${reportId}`);
  };

  if (isLoading) {
    return <ReportsLoadingState />;
  }

  if (error) {
    return (
      <ReportsErrorState 
        message={error} 
        onRetry={onRetry}
      />
    );
  }

  if (reports.length === 0) {
    return <ReportsEmptyState filterActive={filterActive} />;
  }

  return (
    <>
      <ReportsTable 
        reports={paginatedReports}
        onViewDetails={handleViewDetails}
        currentPage={currentPage}
        totalItems={reports.length}
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
  );
};

export default ReportsContent;
