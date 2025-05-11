
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, Layers } from "lucide-react";
import LeafletMap from "@/components/LeafletMap";
import type { MapMarker } from "@/types/map";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MapSectionProps {
  mapMarkers: MapMarker[];
  userPosition: [number, number] | null;
  onMarkerClick: (marker: MapMarker) => void;
}

const MapSection = ({ mapMarkers, userPosition, onMarkerClick }: MapSectionProps) => {
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showTraffic, setShowTraffic] = useState(false);
  const [filteredMarkers, setFilteredMarkers] = useState<MapMarker[]>(mapMarkers);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Count types of incidents for the filter menu
  const incidentTypes = mapMarkers.reduce<Record<string, number>>((acc, marker) => {
    const type = marker.type || 'Não categorizado';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // Handle filter changes with improved UX
  const toggleFilter = (type: string) => {
    const newFilters = activeFilters.includes(type)
      ? activeFilters.filter(t => t !== type)
      : [...activeFilters, type];
    
    setActiveFilters(newFilters);
    
    // Apply filters to markers
    if (newFilters.length === 0) {
      setFilteredMarkers(mapMarkers);
      if (activeFilters.length > 0) {
        toast.success("Filtros removidos", {
          description: "Mostrando todas as ocorrências"
        });
      }
    } else {
      const filtered = mapMarkers.filter(marker => 
        newFilters.includes(marker.type || 'Não categorizado')
      );
      setFilteredMarkers(filtered);
      
      if (newFilters.length !== activeFilters.length || !activeFilters.every(f => newFilters.includes(f))) {
        toast.info(`${filtered.length} ocorrências encontradas`, {
          description: `Filtro${newFilters.length > 1 ? 's' : ''}: ${newFilters.join(', ')}`
        });
      }
    }
  };

  // Toggle layer with UX feedback
  const toggleLayer = (layer: 'heatmap' | 'traffic', value: boolean) => {
    if (layer === 'heatmap') {
      setShowHeatmap(value);
      toast.info(value ? "Mapa de calor ativado" : "Mapa de calor desativado", {
        duration: 2000,
      });
    } else {
      setShowTraffic(value);
      // Toast is handled in the useMapTraffic hook
    }
  };

  return (
    <Card className="lg:col-span-2 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle>Mapa de Ocorrências</CardTitle>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1 hover:bg-secondary/80 transition-colors">
                <Filter className="h-4 w-4" />
                <span>Filtrar</span>
                {activeFilters.length > 0 && (
                  <Badge variant="info" className="ml-1 h-5 px-1 animate-fade-in">
                    {activeFilters.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Tipos de Ocorrência</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.entries(incidentTypes).map(([type, count]) => (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={activeFilters.includes(type)}
                  onCheckedChange={() => toggleFilter(type)}
                  className="transition-colors hover:bg-secondary/20"
                >
                  {type} ({count})
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1 hover:bg-secondary/80 transition-colors">
                <Layers className="h-4 w-4" />
                <span>Camadas</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuCheckboxItem
                checked={showHeatmap}
                onCheckedChange={(checked) => toggleLayer('heatmap', checked)}
                className="transition-colors hover:bg-secondary/20"
              >
                Mapa de calor
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showTraffic}
                onCheckedChange={(checked) => toggleLayer('traffic', checked)}
                className="transition-colors hover:bg-secondary/20"
              >
                Tráfego
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <LeafletMap 
          height="320px"
          markers={filteredMarkers}
          showUserLocation={true}
          onMarkerClick={onMarkerClick}
          center={userPosition || [-23.55052, -46.633308]}
          showHeatmap={showHeatmap}
          showTraffic={showTraffic}
        />
      </CardContent>
      <div className="p-3 border-t border-border flex flex-wrap gap-3 text-xs">
        <div className="flex items-center transition-transform hover:scale-105">
          <span className="inline-block h-3 w-3 rounded-full bg-blue-500 mr-1.5"></span>
          <span>Pendente</span>
        </div>
        <div className="flex items-center transition-transform hover:scale-105">
          <span className="inline-block h-3 w-3 rounded-full bg-orange-500 mr-1.5"></span>
          <span>Em andamento</span>
        </div>
        <div className="flex items-center transition-transform hover:scale-105">
          <span className="inline-block h-3 w-3 rounded-full bg-green-500 mr-1.5"></span>
          <span>Resolvido</span>
        </div>
        {activeFilters.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-5 text-xs ml-auto transition-colors hover:bg-red-50 hover:text-red-600"
            onClick={() => {
              setActiveFilters([]);
              setFilteredMarkers(mapMarkers);
              toast.success("Filtros limpos", {
                description: "Mostrando todas as ocorrências"
              });
            }}
          >
            Limpar filtros
          </Button>
        )}
      </div>
    </Card>
  );
};

export default MapSection;
