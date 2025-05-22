
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import BaseHeader from "@/components/shared/BaseHeader";

interface MapViewHeaderProps {
  filter: string;
  setFilter: (value: string) => void;
  enableClustering: boolean;
  setEnableClustering: (value: boolean) => void;
}

const MapViewHeader = ({ 
  filter, 
  setFilter, 
  enableClustering, 
  setEnableClustering 
}: MapViewHeaderProps) => {
  const filterActions = (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex items-center gap-2">
        <Label htmlFor="filter" className="whitespace-nowrap text-muted-foreground">Filtrar por:</Label>
        <Select value={filter} onValueChange={setFilter} disabled>
          <SelectTrigger id="filter" className="w-[180px] opacity-60">
            <SelectValue placeholder="Todas as ocorrências" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as ocorrências</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center gap-2">
        <Label htmlFor="clustering" className="whitespace-nowrap text-muted-foreground">
          Agrupar marcadores:
        </Label>
        <Switch
          id="clustering"
          checked={enableClustering}
          onCheckedChange={setEnableClustering}
          disabled
        />
      </div>
    </div>
  );

  return (
    <BaseHeader
      title="Mapa de Ocorrências"
      description="Recurso de mapa desativado nesta versão do aplicativo"
      actions={filterActions}
    />
  );
};

export default MapViewHeader;
