
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlayCircle, PauseCircle } from 'lucide-react';

interface TrackingControlsProps {
  tracking: boolean;
  toggleTracking: () => void;
  permissionDenied: boolean;
}

const TrackingControls: React.FC<TrackingControlsProps> = ({ 
  tracking, 
  toggleTracking,
  permissionDenied
}) => {
  return (
    <div>
      <Button
        size="sm"
        variant={tracking ? "outline" : "default"}
        onClick={toggleTracking}
        disabled={permissionDenied}
        className={`w-full ${tracking ? 'border-red-300 hover:bg-red-50 text-red-600' : 'bg-green-600 hover:bg-green-700 text-white'}`}
      >
        {tracking ? (
          <>
            <PauseCircle className="mr-2 h-4 w-4" /> Pausar Rastreamento
          </>
        ) : (
          <>
            <PlayCircle className="mr-2 h-4 w-4" /> Iniciar Rastreamento
          </>
        )}
      </Button>
    </div>
  );
};

export default TrackingControls;
