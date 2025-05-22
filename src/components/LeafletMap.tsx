
import React from 'react';
import type { MapMarker } from '@/types/map';

export type { MapMarker };

interface LeafletMapProps {
  markers?: MapMarker[];
  showUserLocation?: boolean;
  center?: [number, number];
  zoom?: number;
  height?: string;
  onMarkerClick?: (marker: MapMarker) => void;
  showTraffic?: boolean;
  showHeatmap?: boolean;
  interactive?: boolean;
  showControls?: boolean;
  enableClustering?: boolean;
}

const LeafletMap = ({
  height = '500px'
}: LeafletMapProps) => {
  return (
    <div className="relative">
      <div className="bg-muted/20 flex items-center justify-center" style={{ height, width: '100%' }}>
        <p className="text-muted-foreground">Mapa não disponível</p>
      </div>
    </div>
  );
};

export default LeafletMap;
