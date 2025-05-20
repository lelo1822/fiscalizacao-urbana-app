
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
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
  // Handle clustering toggle
  const handleClusteringToggle = (enabled: boolean) => {
    setEnableClustering(enabled);
    toast({
      title: enabled ? "Agrupamento de marcadores ativado" : "Agrupamento de marcadores desativado",
      description: "A visualização do mapa foi atualizada",
      duration: 2000
    });
  };

  const filterActions = (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex items-center gap-2">
        <Label htmlFor="filter" className="whitespace-nowrap">Filtrar por:</Label>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger id="filter" className="w-[180px]">
            <SelectValue placeholder="Todas as ocorrências" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as ocorrências</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="in_progress">Em andamento</SelectItem>
            <SelectItem value="resolved">Resolvidas</SelectItem>
            <SelectItem value="buracos">Buracos na via</SelectItem>
            <SelectItem value="árvore">Poda de árvores</SelectItem>
            <SelectItem value="lâmpada">Lâmpadas queimadas</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center gap-2">
        <Label htmlFor="clustering" className="whitespace-nowrap">
          Agrupar marcadores:
        </Label>
        <Switch
          id="clustering"
          checked={enableClustering}
          onCheckedChange={handleClusteringToggle}
        />
      </div>
    </div>
  );

  return (
    <BaseHeader
      title="Mapa de Ocorrências"
      description="Visualize todas as ocorrências registradas"
      actions={filterActions}
    />
  );
};

export default MapViewHeader;
