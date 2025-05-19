
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow
} from "@/components/ui/table";
import { Report } from "@/types/dashboard";

interface ReportsTableProps {
  reports: Report[];
  onViewDetails: (reportId: number) => void;
  currentPage: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
}

const ReportsTable = ({ 
  reports, 
  onViewDetails,
  startIndex,
  endIndex, 
  totalItems 
}: ReportsTableProps) => {

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Endereço</TableHead>
            <TableHead className="hidden md:table-cell">Reclamante</TableHead>
            <TableHead className="hidden md:table-cell">Data</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-medium">{report.id}</TableCell>
              <TableCell>{report.type}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                {report.address}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {report.complainant?.fullName || "Não informado"}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {formatDate(report.createdAt)}
              </TableCell>
              <TableCell>
                <Badge className={
                  report.status === "Pendente" ? "bg-blue-500" : 
                  report.status === "Em andamento" ? "bg-amber-500" : 
                  "bg-green-500"
                }>
                  {report.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails(report.id)}
                >
                  Ver
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="text-sm px-4 py-2 text-muted-foreground border-t">
        Exibindo {startIndex + 1}-{endIndex + 1} de {totalItems} ocorrências
      </div>
    </div>
  );
};

export default ReportsTable;
