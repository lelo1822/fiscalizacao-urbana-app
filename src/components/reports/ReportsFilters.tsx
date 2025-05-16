
import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";

interface ReportsFiltersProps {
  uniqueTypes: string[];
  onSearchChange: (query: string) => void;
  onStatusFilterChange: (status: string) => void;
  onTypeFilterChange: (type: string) => void;
}

const ReportsFilters = ({ 
  uniqueTypes, 
  onSearchChange, 
  onStatusFilterChange, 
  onTypeFilterChange 
}: ReportsFiltersProps) => {
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
      <div className="flex gap-2">
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
      </div>
    </div>
  );
};

export default ReportsFilters;
