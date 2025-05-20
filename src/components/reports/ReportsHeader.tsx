
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ExcelExportButton from "./ExcelExportButton";
import { Report } from "@/types/dashboard";
import BaseHeader from "@/components/shared/BaseHeader";

interface ReportsHeaderProps {
  gabineteId?: string;
  reports: Report[];
  isLoading: boolean;
}

const ReportsHeader = ({ gabineteId, reports, isLoading }: ReportsHeaderProps) => {
  const navigate = useNavigate();

  const headerDescription = gabineteId 
    ? `Ocorrências do Gabinete ${gabineteId}` 
    : "Todas as ocorrências";

  const headerActions = (
    <>
      <Button 
        variant="outline" 
        onClick={() => navigate('/report/new')}
      >
        <FileText className="mr-2 h-4 w-4" />
        Nova Ocorrência
      </Button>
      <ExcelExportButton 
        reports={reports} 
        fileName={`ocorrencias_gabinete_${gabineteId || 'todos'}`}
        isLoading={isLoading}
      />
    </>
  );

  return (
    <BaseHeader
      title="Lista de Ocorrências"
      description={headerDescription}
      actions={headerActions}
    />
  );
};

export default ReportsHeader;
