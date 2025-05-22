
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
        <div className="text-center text-muted-foreground py-8">
          Informações de localização não disponíveis
        </div>
      </CardContent>
    </Card>
  );
};

export default NearbyIssuesSection;
