
import { Activity, Clock, Navigation } from "lucide-react";

interface RouteSummaryMetricsProps {
  distance: string;
  duration: string;
  occurrences: number;
}

const RouteSummaryMetrics = ({ distance, duration, occurrences }: RouteSummaryMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-gray-50 p-4 rounded-md">
        <div className="flex items-center gap-2 text-gray-500">
          <Navigation className="h-4 w-4" />
          <span>Distância Percorrida</span>
        </div>
        <div className="text-2xl font-bold mt-1">{distance}</div>
      </div>
      <div className="bg-gray-50 p-4 rounded-md">
        <div className="flex items-center gap-2 text-gray-500">
          <Clock className="h-4 w-4" />
          <span>Tempo Ativo</span>
        </div>
        <div className="text-2xl font-bold mt-1">{duration}</div>
      </div>
      <div className="bg-gray-50 p-4 rounded-md">
        <div className="flex items-center gap-2 text-gray-500">
          <Activity className="h-4 w-4" />
          <span>Ocorrências</span>
        </div>
        <div className="text-2xl font-bold mt-1">{occurrences}</div>
      </div>
    </div>
  );
};

export default RouteSummaryMetrics;
