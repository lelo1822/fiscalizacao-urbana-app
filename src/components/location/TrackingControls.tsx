
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlayCircle, PauseCircle, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  if (permissionDenied) {
    return (
      <div className="space-y-2">
        <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-2 rounded-md">
          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="text-xs">Permissão necessária para rastreamento</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={toggleTracking}
          className="w-full border-amber-300 hover:bg-amber-50 text-amber-600"
        >
          <AlertCircle className="mr-2 h-4 w-4" /> Solicitar Permissão
        </Button>
      </div>
    );
  }

  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant={tracking ? "outline" : "default"}
              onClick={toggleTracking}
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
          </TooltipTrigger>
          <TooltipContent>
            <p>{tracking ? 'Desativar o rastreamento de localização' : 'Ativar o rastreamento de localização'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default TrackingControls;
