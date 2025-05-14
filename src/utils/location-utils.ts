
import { toast } from "@/hooks/use-toast";

// Check location permissions
export const checkLocationPermission = async (): Promise<PermissionState> => {
  try {
    if (navigator.permissions) {
      const permission = await navigator.permissions.query({ name: "geolocation" as PermissionName });
      return permission.state;
    }
    // If permissions API is not available, return "prompt" as a fallback
    return "prompt";
  } catch (error) {
    console.error("Error checking location permission:", error);
    return "prompt"; // Default fallback
  }
};

// Handle location errors
export const handleLocationError = (error: Error | GeolocationPositionError, setPermissionDenied?: (value: boolean) => void) => {
  console.error("Location error:", error);
  
  // GeolocationPositionError
  if ('code' in error) {
    switch (error.code) {
      case 1: // PERMISSION_DENIED
        if (setPermissionDenied) setPermissionDenied(true);
        toast({
          title: "Permissão de localização negada",
          description: "Habilite a localização no seu navegador para usar este recurso",
          variant: "destructive"
        });
        break;
      case 2: // POSITION_UNAVAILABLE
        toast({
          title: "Localização indisponível",
          description: "Não foi possível obter sua localização atual",
          variant: "destructive"
        });
        break;
      case 3: // TIMEOUT
        toast({
          title: "Tempo esgotado",
          description: "Demorou muito para obter sua localização",
          variant: "destructive"
        });
        break;
      default:
        toast({
          title: "Erro de localização",
          description: error.message || "Ocorreu um erro ao acessar sua localização",
          variant: "destructive"
        });
    }
  } else {
    // Generic Error
    toast({
      title: "Erro de localização",
      description: error.message || "Ocorreu um erro ao acessar sua localização",
      variant: "destructive"
    });
  }
};

// Create a permission denied error
export const createPermissionDeniedError = (): GeolocationPositionError => {
  return {
    code: 1,
    message: "User denied geolocation",
    PERMISSION_DENIED: 1,
    POSITION_UNAVAILABLE: 2,
    TIMEOUT: 3
  };
};
