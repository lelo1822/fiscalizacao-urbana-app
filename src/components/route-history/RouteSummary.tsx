
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RouteSummaryMetrics from "./RouteSummaryMetrics";
import StopPointsList from "./StopPointsList";

interface StopPoint {
  id: number;
  location: string;
  timeRange: string;
  duration: string;
  type: string;
}

interface RouteSummaryProps {
  distance: string;
  duration: string;
  occurrences: number;
  stopPoints: StopPoint[];
}

const RouteSummary = ({ distance, duration, occurrences, stopPoints }: RouteSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo de Atividades</CardTitle>
      </CardHeader>
      <CardContent>
        <RouteSummaryMetrics 
          distance={distance} 
          duration={duration} 
          occurrences={occurrences} 
        />
        <StopPointsList stopPoints={stopPoints} />
      </CardContent>
    </Card>
  );
};

export default RouteSummary;
