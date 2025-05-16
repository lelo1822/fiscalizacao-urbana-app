
import React from 'react';
import { MapPin, Shield, AlertCircle, Clock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

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

  // Calcular quanto tempo se passou desde a última atualização
  const getTimeSinceUpdate = () => {
    if (!lastUpdate) return null;
    
    const now = new Date();
    const diffMs = now.getTime() - lastUpdate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "agora mesmo";
    if (diffMins === 1) return "há 1 minuto";
    return `há ${diffMins} minutos`;
  };

  if (!isSecureContext) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-md p-2 mb-2">
        <div className="flex items-center text-amber-600">
          <Shield className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="text-xs">
            Rastreamento indisponível: contexto não seguro (HTTPS necessário)
          </span>
        </div>
      </div>
    );
  }

  if (permissionDenied) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-2 mb-2">
        <div className="flex items-center text-red-600">
          <AlertCircle className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="text-xs">
            Permissão negada. Habilite o acesso à localização nas configurações do navegador.
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-2 mb-2">
        <div className="flex items-center text-red-600">
          <AlertCircle className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="text-xs">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-2">
      {tracking ? (
        <div className="bg-green-50 border border-green-200 rounded-md p-2">
          <div className="flex items-center">
            <div className="mr-2 relative">
              <MapPin className="h-5 w-5 text-green-600" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-green-500 animate-ping"></span>
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-green-500"></span>
            </div>
            <div>
              <div className="flex items-center">
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 text-xs">
                  Ativo
                </Badge>
              </div>
              {lastUpdate && (
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Última atualização: {formatTime(lastUpdate)} ({getTimeSinceUpdate()})</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-100 border border-gray-200 rounded-md p-2">
          <div className="flex items-center text-gray-500">
            <MapPin className="mr-2 h-4 w-4" />
            <div>
              <span className="text-xs font-medium">Rastreamento desativado</span>
              <div className="text-xs mt-1">Ative para começar a monitorar sua localização</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackingStatus;
