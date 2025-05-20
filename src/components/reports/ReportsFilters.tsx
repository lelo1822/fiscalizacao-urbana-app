
import { useState } from "react";
import { Search, Filter, Calendar, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, subDays } from "date-fns";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [datePresetLabel, setDatePresetLabel] = useState<string>("Período");

  const handleDateChange = (type: 'start' | 'end', date: Date | undefined) => {
    if (type === 'start') {
      setStartDate(date);
      setDatePresetLabel("Personalizado");
    } else {
      setEndDate(date);
      setDatePresetLabel("Personalizado");
    }
    onDateRangeChange(type === 'start' ? date : startDate, type === 'end' ? date : endDate);
  };

  const clearDateFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setDatePresetLabel("Período");
    onDateRangeChange(undefined, undefined);
  };

  const applyDatePreset = (preset: string) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today

    let start: Date | undefined;
    let end: Date = today;

    switch (preset) {
      case "today":
        start = new Date();
        start.setHours(0, 0, 0, 0); // Start of today
        setDatePresetLabel("Hoje");
        break;
      case "yesterday":
        start = subDays(today, 1);
        start.setHours(0, 0, 0, 0); // Start of yesterday
        end = new Date(start);
        end.setHours(23, 59, 59, 999); // End of yesterday
        setDatePresetLabel("Ontem");
        break;
      case "last7days":
        start = subDays(today, 6);
        start.setHours(0, 0, 0, 0); // Start of 7 days ago
        setDatePresetLabel("Últimos 7 dias");
        break;
      case "last30days":
        start = subDays(today, 29);
        start.setHours(0, 0, 0, 0); // Start of 30 days ago
        setDatePresetLabel("Últimos 30 dias");
        break;
      case "last90days":
        start = subDays(today, 89);
        start.setHours(0, 0, 0, 0); // Start of 90 days ago
        setDatePresetLabel("Últimos 90 dias");
        break;
      default:
        start = undefined;
        end = undefined;
        break;
    }

    setStartDate(start);
    setEndDate(end);
    onDateRangeChange(start, end);
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
        
        {/* Date Range Filter with Presets */}
        <div className="flex gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-40">
                <Calendar className="mr-2 h-4 w-4" />
                {datePresetLabel}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <DropdownMenuItem onClick={() => applyDatePreset("today")}>
                Hoje
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => applyDatePreset("yesterday")}>
                Ontem
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => applyDatePreset("last7days")}>
                Últimos 7 dias
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => applyDatePreset("last30days")}>
                Últimos 30 dias
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => applyDatePreset("last90days")}>
                Últimos 90 dias
              </DropdownMenuItem>
              <DropdownMenuItem onClick={clearDateFilters}>
                Limpar filtro
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Custom Date Range Selection */}
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
          
          {/* End Date Selection */}
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
        </div>
        
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
