
import React from "react";
import Layout from "../components/Layout";
import MapContainer from "@/components/map-view/MapContainer";
import MapViewHeader from "@/components/map-view/MapViewHeader";
import { useState, useEffect } from "react";
import { getFilteredReports, convertReportsToMarkers } from "@/services/reportService";
import type { MapMarker } from "@/types/map";
import LocationTracker from "@/components/LocationTracker";

const MapPage = () => {
  const [filter, setFilter] = useState("all");
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [enableClustering, setEnableClustering] = useState(true);

  // Filter reports based on selected filter
  useEffect(() => {
    const filteredReports = getFilteredReports(filter);
    const newMarkers = convertReportsToMarkers(filteredReports);
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
        }
      );
    }
  }, []);
  
  return (
    <Layout>
      <div className="p-4 md:p-8">
        <MapViewHeader 
          filter={filter}
          setFilter={setFilter}
          enableClustering={enableClustering}
          setEnableClustering={setEnableClustering}
        />
        <MapContainer 
          markers={markers}
          userLocation={userLocation}
          enableClustering={enableClustering}
        />
      </div>
      <LocationTracker />
    </Layout>
  );
};

export default MapPage;
