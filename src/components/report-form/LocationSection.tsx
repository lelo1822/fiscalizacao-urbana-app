
import { MapPin } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface LocationSectionProps {
  address: string;
  setAddress: (address: string) => void;
}

const LocationSection = ({ address, setAddress }: LocationSectionProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <MapPin className="h-5 w-5 text-primary mr-2" />
        <Label>Localização</Label>
      </div>
      <div>
        <Input 
          value={address} 
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Digite o endereço completo da ocorrência"
          required
        />
        <p className="text-sm text-muted-foreground mt-2">
          Informe o endereço completo onde ocorreu o problema.
        </p>
      </div>
    </div>
  );
};

export default LocationSection;
