
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface Issue {
  id: number;
  type: string;
  address: string;
  status: string;
}

interface NearbyIssuesSectionProps {
  issues: Issue[];
  onViewDetails: (id: number) => void;
  isLoading: boolean;
}

const NearbyIssuesSection = ({ issues = [], onViewDetails, isLoading }: NearbyIssuesSectionProps) => {
  if (!issues || issues.length === 0) {
    return (
      <Card className="mb-6 hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 text-warning mr-2" />
            Ocorrências Próximas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Nenhuma ocorrência próxima encontrada.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <AlertCircle className="h-5 w-5 text-warning mr-2" />
          Ocorrências Próximas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="p-4 border rounded-md bg-amber-50 border-amber-200 flex justify-between items-center hover:bg-amber-100 transition-colors"
            >
              <div>
                <h4 className="font-medium">{issue.type}</h4>
                <p className="text-sm text-muted-foreground">{issue.address}</p>
                <div className="mt-1">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    issue.status === "Resolvido" ? "bg-success/20 text-success" : 
                    issue.status === "Em análise" ? "bg-warning/20 text-warning" :
                    "bg-secondary/20 text-secondary"
                  }`}>
                    {issue.status}
                  </span>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onViewDetails(issue.id)}
                disabled={isLoading}
                className="hover:bg-amber-200 hover:text-amber-800"
              >
                Ver Detalhes
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NearbyIssuesSection;
