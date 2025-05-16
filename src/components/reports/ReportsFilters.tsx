
import { useState } from "react";
import { Search, Filter, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ReportsFiltersProps {
  uniqueTypes: string[];
  onSearchChange: (query: string) => void;
  onStatusFilterChange: (status: string) => void;
  onTypeFilterChange: (type: string) => void;
  onDateRangeChange: (startDate: Date | undefined, endDate: Date | undefined) => void;
}

const ReportsFilters = ({ 
  uniqueTypes, 
  onSearchChange, 
  onStatusFilterChange, 
  onTypeFilterChange,
  onDateRangeChange
}: ReportsFiltersProps) => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleDateChange = (type: 'start' | 'end', date: Date | undefined) => {
    if (type === 'start') {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
    onDateRangeChange(type === 'start' ? date : startDate, type === 'end' ? date : endDate);
  };

  const clearDateFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    onDateRangeChange(undefined, undefined);
  };

  return (
    <div className="mb-6 flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar ocorrências..."
            className="pl-8"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="w-40">
          <Select defaultValue="all" onValueChange={onStatusFilterChange}>
            <SelectTrigger>
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="in_progress">Em andamento</SelectItem>
              <SelectItem value="resolved">Resolvidas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-48">
          <Select defaultValue="all" onValueChange={onTypeFilterChange}>
            <SelectTrigger>
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              {uniqueTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Date Range Filter - Start Date */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className={cn(
                "w-40",
                !startDate && "text-muted-foreground"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "dd/MM/yyyy") : "Data inicial"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CalendarComponent
              mode="single"
              selected={startDate}
              onSelect={(date) => handleDateChange('start', date)}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        
        {/* Date Range Filter - End Date */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className={cn(
                "w-40",
                !endDate && "text-muted-foreground"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "dd/MM/yyyy") : "Data final"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CalendarComponent
              mode="single"
              selected={endDate}
              onSelect={(date) => handleDateChange('end', date)}
              disabled={(date) => startDate ? date < startDate : false}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        
        {/* Clear Date Filters button - only show if dates are selected */}
        {(startDate || endDate) && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={clearDateFilters}
            className="h-10 w-10"
          >
            ×
          </Button>
        )}
      </div>
    </div>
  );
};

export default ReportsFilters;
