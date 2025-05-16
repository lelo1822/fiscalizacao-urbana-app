
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ExcelExportButton from "./ExcelExportButton";
import { Report } from "@/types/dashboard";

interface ReportsHeaderProps {
  gabineteId?: string;
  reports: Report[];
  isLoading: boolean;
}

const ReportsHeader = ({ gabineteId, reports, isLoading }: ReportsHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Lista de Ocorrências
        </h1>
        <p className="text-gray-500">
          {gabineteId 
            ? `Ocorrências do Gabinete ${gabineteId}` 
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
          reports={reports} 
          fileName={`ocorrencias_gabinete_${gabineteId || 'todos'}`}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ReportsHeader;
