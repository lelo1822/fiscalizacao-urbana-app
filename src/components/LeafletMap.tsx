
import React from 'react';
import type { MapMarker } from '@/types/map';
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

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
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center" style={{ height }}>
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Mapa não disponível</h3>
        <p className="text-muted-foreground text-center">
          O recurso de mapa foi desativado nesta versão do aplicativo.
        </p>
      </CardContent>
    </Card>
  );
};

export default LeafletMap;
