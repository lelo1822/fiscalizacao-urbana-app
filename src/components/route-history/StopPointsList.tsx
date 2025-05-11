
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

interface StopPoint {
  id: number;
  location: string;
  timeRange: string;
  duration: string;
  type: string;
}

interface StopPointsListProps {
  stopPoints: StopPoint[];
}

const StopPointsList = ({ stopPoints }: StopPointsListProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Pontos de Parada</h3>
        <Badge variant="outline" className="text-xs">
          {stopPoints.length} paradas
        </Badge>
      </div>
      
      {stopPoints.length > 0 ? (
        <div className="space-y-3">
          {stopPoints.map((stop) => (
            <div key={stop.id} className="border rounded-md p-3 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">
                    {stop.location}
                  </div>
                  <div className="text-sm text-gray-500">
                    {stop.timeRange} ({stop.duration})
                  </div>
                </div>
                <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
                  {stop.type}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center border rounded-md border-dashed">
          <AlertCircle className="h-12 w-12 text-muted-foreground opacity-20" />
          <p className="mt-2 text-muted-foreground">Nenhuma parada registrada nesta data</p>
        </div>
      )}
    </div>
  );
};

export default StopPointsList;
