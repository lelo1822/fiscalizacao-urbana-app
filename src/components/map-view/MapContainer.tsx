
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import LeafletMap from "@/components/LeafletMap";
import MapLegend from "./MapLegend";
import type { MapMarker } from "@/types/map";
import { useNavigate } from "react-router-dom";

interface MapContainerProps {
  markers: MapMarker[];
  userLocation: [number, number] | null;
  enableClustering: boolean;
}

const MapContainer = ({ 
  markers, 
  userLocation, 
  enableClustering 
}: MapContainerProps) => {
  const navigate = useNavigate();

  // Handle marker click to navigate to report detail
  const handleMarkerClick = (marker: MapMarker) => {
    navigate(`/report/${marker.id}`);
  };

  return (
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
            enableClustering={enableClustering}
          />
          <MapLegend />
        </div>
      </CardContent>
    </Card>
  );
};

export default MapContainer;
