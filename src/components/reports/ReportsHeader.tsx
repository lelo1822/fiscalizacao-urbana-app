
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ExcelExportButton from "./ExcelExportButton";
import { Report } from "@/types/dashboard";
import BaseHeader from "@/components/shared/BaseHeader";
import { useAuth } from "@/context/AuthContext";

interface ReportsHeaderProps {
  gabineteId?: string;
  reports: Report[];
  isLoading: boolean;
}

const ReportsHeader = ({ gabineteId, reports, isLoading }: ReportsHeaderProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Get councilor name based on gabineteId or use the current user's name if it's the user's gabinete
  const getCouncilorName = () => {
    if (!gabineteId) return "Todas";
    if (user?.gabineteId === gabineteId) return user.name || `Gabinete ${gabineteId}`;
    
    // In a real app, you would fetch the councilor name from a list of councilors
    // For now, we'll just show the gabinete with a better format
    return `Vereador(a) do Gabinete ${gabineteId}`;
  };

  const headerDescription = gabineteId 
    ? `Ocorrências de ${getCouncilorName()}` 
    : "Todas as ocorrências";

  const headerActions = (
    <>
      <Button 
        variant="outline" 
        onClick={() => navigate('/report/new')}
        disabled={isLoading}
      >
        <FileText className="mr-2 h-4 w-4" />
        Nova Ocorrência
      </Button>
      <ExcelExportButton 
        reports={reports} 
        fileName={`ocorrencias_${gabineteId ? `gabinete_${gabineteId}` : 'todos'}`}
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
