
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RouteDay {
  date: string;
  points: number;
  distance: string;
  duration: string;
}

interface RouteHistoryListProps {
  routeDays: RouteDay[];
  selectedDate: Date | undefined;
  onSelectDate: (date: Date) => void;
}

const RouteHistoryList = ({ routeDays, selectedDate, onSelectDate }: RouteHistoryListProps) => {
  return (
    <div className="space-y-4">
      {routeDays.map((day, index) => (
        <Button 
          key={index} 
          variant="outline" 
          className={cn(
            "w-full justify-start text-left h-auto py-3 px-4 font-normal",
            selectedDate && format(selectedDate, 'yyyy-MM-dd') === day.date ? "border-primary bg-primary/5" : ""
          )}
          onClick={() => onSelectDate(new Date(day.date))}
        >
          <div className="w-full">
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {format(new Date(day.date), "EEEE, dd 'de' MMMM", { locale: ptBR })}
              </span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                {day.points} pontos
              </span>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-500">
              <span>{day.distance}</span>
              <span>{day.duration}</span>
            </div>
          </div>
        </Button>
      ))}
      
      <Button 
        className="w-full mt-4" 
        variant="outline"
      >
        Ver histórico completo
      </Button>
    </div>
  );
};

export default RouteHistoryList;
