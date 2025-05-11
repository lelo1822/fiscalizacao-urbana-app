
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import LocationTracker from "@/components/LocationTracker";
import LeafletMap from "@/components/LeafletMap";
import type { MapMarker } from "@/types/map";

// Mock data for reports (in a real app, this would come from an API)
const mockReports = [
  {
    id: "1",
    type: "Buraco na via",
    address: "Rua das Flores, 123 - Centro",
    position: [-23.55052, -46.633308] as [number, number],
    status: "pending" as const,
    date: "2023-05-08T10:30:00"
  },
  {
    id: "2",
    type: "Árvore caída",
    address: "Av. Principal, 456 - Jardim",
    position: [-23.54550, -46.638100] as [number, number],
    status: "in_progress" as const,
    date: "2023-05-07T08:45:00"
  },
  {
    id: "3",
    type: "Lâmpada queimada",
    address: "Praça Central",
    position: [-23.56052, -46.629708] as [number, number],
    status: "resolved" as const,
    date: "2023-05-06T16:20:00"
  },
  {
    id: "4",
    type: "Lixo acumulado",
    address: "Rua Lateral, 789 - Vila Nova",
    position: [-23.55552, -46.641308] as [number, number],
    status: "pending" as const,
    date: "2023-05-05T11:15:00"
  },
  {
    id: "5",
    type: "Buraco na via",
    address: "Av. Secundária, 321 - Bairro Sul",
    position: [-23.54852, -46.623308] as [number, number],
    status: "in_progress" as const,
    date: "2023-05-04T09:30:00"
  },
];

const MapView = () => {
  const [filter, setFilter] = useState("all");
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Filter reports based on selected filter
  useEffect(() => {
    let filteredReports = [...mockReports];
    
    if (filter !== "all") {
      if (["pending", "in_progress", "resolved"].includes(filter)) {
        filteredReports = mockReports.filter(report => report.status === filter);
      } else {
        // Filter by type of issue
        filteredReports = mockReports.filter(report => 
          report.type.toLowerCase().includes(filter.toLowerCase())
        );
      }
    }
    
    // Convert reports to map markers
    const newMarkers: MapMarker[] = filteredReports.map(report => ({
      id: report.id,
      position: report.position,
      title: report.address,
      status: report.status,
      type: report.type
    }));
    
    setMarkers(newMarkers);
  }, [filter]);

  // Get user location once
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.error("Erro ao obter localização:", error);
          toast({
            title: "Erro",
            description: "Não foi possível obter sua localização",
            variant: "destructive"
          });
        }
      );
    }
  }, []);

  // Handle marker click to navigate to report detail
  const handleMarkerClick = (marker: MapMarker) => {
    navigate(`/report/${marker.id}`);
  };
  
  return (
    <Layout>
      <div className="p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Mapa de Ocorrências
            </h1>
            <p className="text-gray-500">
              Visualize todas as ocorrências registradas
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-4">
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
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="relative w-full h-[70vh]">
              <LeafletMap 
                markers={markers} 
                showUserLocation={true}
                center={userLocation || [-23.55052, -46.633308]}
                zoom={13}
                height="70vh"
                onMarkerClick={handleMarkerClick}
              />
              
              {/* Legend */}
              <div className="absolute bottom-4 left-4 p-3 bg-white rounded-md shadow-md">
                <h3 className="font-medium mb-2">Legenda</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-3 w-3 rounded-full bg-blue-500"></span>
                    <span>Pendentes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-3 w-3 rounded-full bg-orange-500"></span>
                    <span>Em andamento</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-3 w-3 rounded-full bg-green-500"></span>
                    <span>Resolvidas</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <LocationTracker />
    </Layout>
  );
};

export default MapView;
