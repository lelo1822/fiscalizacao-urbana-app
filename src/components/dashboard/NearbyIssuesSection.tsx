
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Issue {
  id: number;
  type: string;
  address: string;
  status: string;
}

interface NearbyIssuesSectionProps {
  issues?: Issue[];
  onViewDetails?: (id: number) => void;
  isLoading?: boolean;
}

const NearbyIssuesSection = ({ issues = [], onViewDetails, isLoading }: NearbyIssuesSectionProps) => {
  return (
    <Card className="mb-6 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle>Ocorrências Próximas</CardTitle>
      </CardHeader>
      <CardContent>
        {issues && issues.length > 0 ? (
          <div className="space-y-3">
            {issues.map((issue) => (
              <div 
                key={issue.id} 
                className="p-3 border border-border rounded-lg hover:border-primary/50 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{issue.type}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{issue.address}</p>
                  </div>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    issue.status === "Resolvido" ? "bg-green-100 text-green-800" : 
                    issue.status === "Em andamento" ? "bg-amber-100 text-amber-800" :
                    "bg-blue-100 text-blue-800"
                  }`}>
                    {issue.status}
                  </span>
                </div>
                {onViewDetails && (
                  <button 
                    onClick={() => onViewDetails(issue.id)}
                    className="text-sm text-primary mt-2 hover:underline"
                  >
                    Ver detalhes
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            Informações de localização não disponíveis
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NearbyIssuesSection;
