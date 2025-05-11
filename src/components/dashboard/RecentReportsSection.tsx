
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Report {
  id: number;
  type: string;
  address: string;
  date: string;
  status: string;
}

interface RecentReportsSectionProps {
  reports: Report[];
  onViewDetails: (reportId: number) => void;
  isLoading: boolean;
}

const RecentReportsSection = ({ reports, onViewDetails, isLoading }: RecentReportsSectionProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle>Ocorrências Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-3 px-2">Tipo</th>
                <th className="py-3 px-2">Endereço</th>
                <th className="py-3 px-2">Data</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Ação</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-2">{report.type}</td>
                  <td className="py-3 px-2">{report.address}</td>
                  <td className="py-3 px-2">{report.date}</td>
                  <td className="py-3 px-2">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      report.status === "Resolvido" ? "bg-success/20 text-success" : 
                      report.status === "Em análise" ? "bg-warning/20 text-warning" :
                      "bg-secondary/20 text-secondary"
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
                      Ver detalhes
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-center">
          <Button 
            variant="outline"
            onClick={() => navigate('/map')}
            className="border-primary text-primary hover:bg-primary/10"
            disabled={isLoading}
          >
            <FileText className="mr-2 h-4 w-4" />
            Ver todos os relatórios
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentReportsSection;
