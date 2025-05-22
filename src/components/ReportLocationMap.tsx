
import React from 'react';
import { AlertCircle } from "lucide-react";

interface ReportLocationMapProps {
  latitude: number;
  longitude: number;
  height?: string;
  className?: string;
}

const ReportLocationMap = ({ height = '200px', className = '' }: ReportLocationMapProps) => {
  return (
    <div 
      style={{ height }} 
      className={`rounded-md overflow-hidden border border-gray-200 flex flex-col items-center justify-center ${className}`}
    >
      <AlertCircle className="h-6 w-6 text-muted-foreground mb-2" />
      <p className="text-sm text-muted-foreground">Visualização de mapa indisponível</p>
    </div>
  );
};

export default ReportLocationMap;
