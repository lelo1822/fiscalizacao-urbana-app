
import React from 'react';
import { ArrowDown, MapPin, Shield, AlertCircle } from 'lucide-react';

interface TrackingStatusProps {
  tracking: boolean;
  error: string | null;
  lastUpdate: Date | null;
  permissionDenied: boolean;
  isSecureContext: boolean;
}

const TrackingStatus: React.FC<TrackingStatusProps> = ({ 
  tracking, 
  error, 
  lastUpdate, 
  permissionDenied,
  isSecureContext
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString();
  };

  if (!isSecureContext) {
    return (
      <div className="flex items-center text-amber-600 mb-2">
        <Shield className="mr-1 h-4 w-4" />
        <span className="text-xs">
          Rastreamento indisponível: contexto não seguro (HTTPS necessário)
        </span>
      </div>
    );
  }

  if (permissionDenied) {
    return (
      <div className="flex items-center text-red-600 mb-2">
        <AlertCircle className="mr-1 h-4 w-4" />
        <span className="text-xs">
          Permissão negada. Habilite o acesso à localização.
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center text-red-600 mb-2">
        <AlertCircle className="mr-1 h-4 w-4" />
        <span className="text-xs">{error}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center mb-2">
      {tracking ? (
        <>
          <div className="flex items-center text-green-600">
            <MapPin className="animate-pulse mr-1 h-4 w-4" />
            <span className="text-xs font-medium">
              Rastreando
              {lastUpdate && (
                <span className="ml-1 font-normal">
                  (Última atualização: {formatTime(lastUpdate)})
                </span>
              )}
            </span>
          </div>
        </>
      ) : (
        <div className="flex items-center text-gray-400">
          <MapPin className="mr-1 h-4 w-4" />
          <span className="text-xs">Rastreamento desativado</span>
        </div>
      )}
    </div>
  );
};

export default TrackingStatus;
