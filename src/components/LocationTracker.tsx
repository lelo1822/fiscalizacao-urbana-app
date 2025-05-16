
import React, { useState } from "react";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { useAuth } from "@/context/AuthContext";
import TrackingStatus from "@/components/location/TrackingStatus";
import TrackingControls from "@/components/location/TrackingControls";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MapPin } from "lucide-react";

const LocationTracker: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const {
    tracking,
    toggleTracking,
    lastUpdate,
    error,
    permissionDenied,
    isSecureContext
  } = useLocationTracking({ userId: user?.id });

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            className={`rounded-full w-10 h-10 shadow-lg p-0 ${tracking ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-500 hover:bg-gray-600'}`}
            size="sm"
          >
            <MapPin className="h-5 w-5 text-white" />
            {tracking && (
              <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-green-500 animate-ping"></span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-3" side="top">
          <div className="font-medium text-sm mb-2 flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span>Status do rastreamento de localização</span>
          </div>
          
          <TrackingStatus
            tracking={tracking}
            error={error}
            lastUpdate={lastUpdate}
            permissionDenied={permissionDenied}
            isSecureContext={isSecureContext}
          />
          
          <TrackingControls
            tracking={tracking}
            toggleTracking={() => {
              toggleTracking();
              // Se estamos ativando o rastreamento, fechamos o popover após um curto atraso
              if (!tracking) {
                setTimeout(() => setOpen(false), 500);
              }
            }}
            permissionDenied={permissionDenied}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LocationTracker;
