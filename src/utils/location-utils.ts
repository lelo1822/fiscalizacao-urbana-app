
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
        // Show toast for permission denied, as this is important feedback for users
        toast({
          title: "Localização desativada",
          description: "Para usar a localização, ative-a nas configurações do navegador",
          variant: "warning"
        });
        break;
      case 2: // POSITION_UNAVAILABLE
        errorMessage = 'Informação de localização indisponível';
        toast({
          title: "Localização indisponível",
          description: "Não foi possível obter sua localização atual",
          variant: "destructive"
        });
        break;
      case 3: // TIMEOUT
        errorMessage = 'Tempo esgotado ao tentar obter localização';
        toast({
          title: "Tempo esgotado",
          description: "O navegador demorou muito para obter sua localização",
          variant: "destructive"
        });
        break;
      default:
        errorMessage = `Erro de geolocalização: ${error.message}`;
        toast({
          title: "Erro de localização",
          description: errorMessage,
          variant: "destructive"
        });
    }

    console.log(errorMessage);
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
      console.log("Permission query result:", result.state);
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

// Function to provide fallback location (São Paulo coordinates)
export const getFallbackLocation = (): [number, number] => {
  return [-23.55052, -46.633308];
};

// Function to calculate distance between two coordinates in kilometers
export const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return distance;
};

// Helper function to convert degrees to radians
const deg2rad = (deg: number): number => {
  return deg * (Math.PI/180);
};
