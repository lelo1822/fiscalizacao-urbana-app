
import React from "react";
import Layout from "../components/Layout";
import MapViewHeader from "@/components/map-view/MapViewHeader";
import MapContainer from "@/components/map-view/MapContainer";

const MapPage = () => {
  // Simplified props since map functionality is disabled
  const markers = [];
  const userLocation = null;
  const enableClustering = false;
  const filter = "all";
  const setFilter = () => {};
  const setEnableClustering = () => {};
  
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
    </Layout>
  );
};

export default MapPage;
