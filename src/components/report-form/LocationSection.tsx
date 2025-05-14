
import { MapPin } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface LocationSectionProps {
  address: string;
  setAddress: (address: string) => void;
  currentLocation: { lat: number; lng: number } | null;
}

const LocationSection = ({ address, setAddress, currentLocation }: LocationSectionProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <MapPin className="h-5 w-5 text-primary mr-2" />
        <Label>Localização</Label>
      </div>
      <div>
        {currentLocation ? (
          <div>
            <div className="text-sm text-muted-foreground mb-2">
              Coordenadas: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
            </div>
            <Input 
              value={address} 
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Endereço completo"
              required
            />
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span>Obtendo sua localização...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSection;
