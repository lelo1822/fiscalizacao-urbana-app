
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Report } from "@/types/dashboard";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";

interface RecentReportsSectionProps {
  reports: Report[];
  onViewDetails: (reportId: number) => void;
  isLoading: boolean;
}

const RecentReportsSection = ({ reports, onViewDetails, isLoading }: RecentReportsSectionProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Format date function
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const renderTableHeaders = () => (
    <tr className="text-left border-b">
      <th className="py-3 px-2">Tipo</th>
      <th className="py-3 px-2">Endereço</th>
      {!isMobile && <th className="py-3 px-2">Data</th>}
      <th className="py-3 px-2">Status</th>
      <th className="py-3 px-2">Ação</th>
    </tr>
  );

  const renderTableContent = () => (
    reports.map((report) => (
      <tr key={report.id} className="border-b hover:bg-gray-50 transition-colors">
        <td className="py-3 px-2">{report.type}</td>
        <td className="py-3 px-2 max-w-[150px] truncate">{report.address}</td>
        {!isMobile && <td className="py-3 px-2">{formatDate(report.createdAt)}</td>}
        <td className="py-3 px-2">
          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
            report.status === "Resolvido" ? "bg-green-100 text-green-800" : 
            report.status === "Em andamento" ? "bg-amber-100 text-amber-800" :
            "bg-blue-100 text-blue-800"
          }`}>
            {report.status}
          </span>
        </td>
        <td className="py-3 px-2">
          <Button 
            size="sm" 
            variant="ghost"
            className="h-8 px-2 text-primary"
            onClick={() => onViewDetails(report.id)}
            disabled={isLoading}
          >
            Ver
          </Button>
        </td>
      </tr>
    ))
  );
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle>Ocorrências Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`overflow-x-auto ${isMobile ? '-mx-4 px-4' : ''}`}>
          <table className="w-full text-sm">
            <thead>
              {renderTableHeaders()}
            </thead>
            <tbody>
              {renderTableContent()}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-center">
          <Button 
            variant="outline"
            onClick={() => navigate('/reports')}
            className="border-primary text-primary hover:bg-primary/10"
            disabled={isLoading}
          >
            <FileText className="mr-2 h-4 w-4" />
            Ver todas as ocorrências
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentReportsSection;
