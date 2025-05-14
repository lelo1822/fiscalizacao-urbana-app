
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, Layers, MapPin } from "lucide-react";
import LeafletMap from "@/components/LeafletMap";
import type { MapMarker } from "@/types/map";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface MapSectionProps {
  mapMarkers: MapMarker[];
  userPosition: [number, number] | null;
  onMarkerClick: (marker: MapMarker) => void;
}

const MapSection = ({ mapMarkers = [], userPosition, onMarkerClick }: MapSectionProps) => {
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showTraffic, setShowTraffic] = useState(false);
  const [filteredMarkers, setFilteredMarkers] = useState<MapMarker[]>(mapMarkers || []);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [markerIconType, setMarkerIconType] = useState<'circle' | 'pin'>('circle');
  const [enableClustering, setEnableClustering] = useState(true);

  // Make sure we update filtered markers when mapMarkers changes
  useState(() => {
    setFilteredMarkers(mapMarkers || []);
  });

  // Count types of incidents for the filter menu
  const incidentTypes = (mapMarkers || []).reduce<Record<string, number>>((acc, marker) => {
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
      setFilteredMarkers(mapMarkers || []);
      if (activeFilters.length > 0) {
        toast({
          title: "Filtros removidos",
          description: "Mostrando todas as ocorrências",
          variant: "default"
        });
      }
    } else {
      const filtered = (mapMarkers || []).filter(marker => 
        newFilters.includes(marker.type || 'Não categorizado')
      );
      setFilteredMarkers(filtered);
      
      if (newFilters.length !== activeFilters.length || !activeFilters.every(f => newFilters.includes(f))) {
        toast({
          title: `${filtered.length} ocorrências encontradas`,
          description: `Filtro${newFilters.length > 1 ? 's' : ''}: ${newFilters.join(', ')}`,
          variant: "default"
        });
      }
    }
  };

  // Toggle layer with UX feedback
  const toggleLayer = (layer: 'heatmap' | 'traffic', value: boolean) => {
    if (layer === 'heatmap') {
      setShowHeatmap(value);
      toast({
        title: value ? "Mapa de calor ativado" : "Mapa de calor desativado", 
        duration: 2000
      });
    } else {
      setShowTraffic(value);
      // Toast is handled in the useMapTraffic hook
    }
  };

  // Change marker icon type
  const changeMarkerIconType = (type: 'circle' | 'pin') => {
    setMarkerIconType(type);
    
    // Apply the icon type to all markers
    const updatedMarkers = (filteredMarkers || []).map(marker => ({
      ...marker,
      iconType: type
    }));
    
    setFilteredMarkers(updatedMarkers);
    
    toast({
      title: type === 'pin' ? "Marcadores em formato de seta ativados" : "Marcadores em formato circular ativados",
      duration: 2000
    });
  };

  // Toggle clustering
  const toggleClustering = (value: boolean) => {
    setEnableClustering(value);
    
    toast({
      title: value ? "Agrupamento de marcadores ativado" : "Agrupamento de marcadores desativado",
      duration: 2000
    });
  };

  return (
    <Card className="lg:col-span-2 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 flex flex-row items-center justify-between relative z-30">
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
            <DropdownMenuContent align="end" className="w-56 z-50 bg-background shadow-lg">
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
            <DropdownMenuContent align="end" className="w-56 z-50 bg-background shadow-lg">
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
              <DropdownMenuCheckboxItem
                checked={enableClustering}
                onCheckedChange={(checked) => toggleClustering(checked)}
                className="transition-colors hover:bg-secondary/20"
              >
                Agrupar marcadores
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Tipo de Marcador</DropdownMenuLabel>
              <DropdownMenuItem 
                onClick={() => changeMarkerIconType('circle')}
                className={`transition-colors hover:bg-secondary/20 ${markerIconType === 'circle' ? 'bg-secondary/30' : ''}`}
              >
                <div className="flex items-center">
                  <span className="inline-block h-3 w-3 rounded-full bg-blue-500 mr-2"></span>
                  Circular
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => changeMarkerIconType('pin')}
                className={`transition-colors hover:bg-secondary/20 ${markerIconType === 'pin' ? 'bg-secondary/30' : ''}`}
              >
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-red-500" />
                  Seta
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <LeafletMap 
          height="320px"
          markers={filteredMarkers || []}
          showUserLocation={true}
          onMarkerClick={onMarkerClick}
          center={userPosition || [-23.55052, -46.633308]}
          showHeatmap={showHeatmap}
          showTraffic={showTraffic}
          enableClustering={enableClustering}
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
              setFilteredMarkers(mapMarkers || []);
              toast({
                title: "Filtros limpos",
                description: "Mostrando todas as ocorrências",
                variant: "default"
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
