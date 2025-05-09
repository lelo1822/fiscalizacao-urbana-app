
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import LocationTracker from "@/components/LocationTracker";

const MapView = () => {
  const [filter, setFilter] = useState("all");
  
  // In a real application, this would load an actual map using a library like Leaflet or Google Maps
  // For the purpose of this demo, we'll just display a mock map interface
  
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
                  <SelectItem value="potholes">Buracos na via</SelectItem>
                  <SelectItem value="trees">Poda de árvores</SelectItem>
                  <SelectItem value="lights">Lâmpadas queimadas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="relative w-full h-[70vh] bg-gray-200">
              {/* Mock Map Interface */}
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-primary mx-auto" />
                  <p className="mt-4 text-gray-600">
                    Aqui será exibido o mapa com todas as ocorrências.
                  </p>
                  <p className="text-sm text-gray-500">
                    Em uma implementação real, utilizaríamos uma biblioteca de mapas como Leaflet ou Google Maps.
                  </p>
                </div>
              </div>
              
              {/* Map Controls (Sample) */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button size="icon" variant="secondary" className="bg-white shadow-md">
                  <span className="text-xl">+</span>
                </Button>
                <Button size="icon" variant="secondary" className="bg-white shadow-md">
                  <span className="text-xl">−</span>
                </Button>
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 p-3 bg-white rounded-md shadow-md">
                <h3 className="font-medium mb-2">Legenda</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-3 w-3 rounded-full bg-primary"></span>
                    <span>Pendentes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-3 w-3 rounded-full bg-warning"></span>
                    <span>Em andamento</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-3 w-3 rounded-full bg-success"></span>
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
