
import { toast } from "@/hooks/use-toast";

// Error handler for geolocation errors
export const handleLocationError = (error: GeolocationPositionError | Error, setPermissionDenied: (denied: boolean) => void) => {
  console.error('Erro ao obter localização:', error);
  
  // Check if it's a GeolocationPositionError
  if ('code' in error) {
    let errorMessage = 'Erro ao acessar sua localização atual';

    switch(error.code) {
      case 1: // PERMISSION_DENIED
        errorMessage = 'Permissão de localização negada pelo usuário';
        setPermissionDenied(true);
        break;
      case 2: // POSITION_UNAVAILABLE
        errorMessage = 'Informação de localização indisponível';
        break;
      case 3: // TIMEOUT
        errorMessage = 'Tempo esgotado ao tentar obter localização';
        break;
      default:
        errorMessage = `Erro de geolocalização: ${error.message}`;
    }

    // Only show toast for genuine errors, not just permission denials
    if (error.code !== 1) {
      toast({
        title: "Erro de localização",
        description: errorMessage,
        variant: "destructive"
      });
    } else {
      // For permission denials, just log it to console
      console.log(errorMessage);
    }
  } else {
    // Generic error handling
    toast({
      title: "Erro de localização",
      description: "Não foi possível obter sua localização atual",
      variant: "destructive"
    });
  }
};

// Check geolocation permissions
export const checkLocationPermission = async (): Promise<"granted" | "prompt" | "denied"> => {
  try {
    if ("permissions" in navigator) {
      const result = await navigator.permissions.query({ name: "geolocation" as PermissionName });
      return result.state as "granted" | "prompt" | "denied";
    }
  } catch (error) {
    console.error("Error checking location permission:", error);
  }
  
  // Default to "prompt" if we can't check permissions
  return "prompt";
};

// Create a mock geolocation error for permission denied cases
export const createPermissionDeniedError = (): GeolocationPositionError => {
  return {
    code: 1, // PERMISSION_DENIED
    message: "Permissão de localização negada",
    PERMISSION_DENIED: 1,
    POSITION_UNAVAILABLE: 2,
    TIMEOUT: 3
  } as GeolocationPositionError;
};
