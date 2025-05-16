
import React from "react";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { useAuth } from "@/context/AuthContext";
import TrackingStatus from "@/components/location/TrackingStatus";
import TrackingControls from "@/components/location/TrackingControls";

const LocationTracker: React.FC = () => {
  const { user } = useAuth();
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
      <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-200 max-w-xs">
        <TrackingStatus
          tracking={tracking}
          error={error}
          lastUpdate={lastUpdate}
          permissionDenied={permissionDenied}
          isSecureContext={isSecureContext}
        />
        <TrackingControls
          tracking={tracking}
          toggleTracking={toggleTracking}
          permissionDenied={permissionDenied}
        />
      </div>
    </div>
  );
};

export default LocationTracker;
