
import { Home } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ComplainantAddressFieldProps {
  address: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const ComplainantAddressField = ({
  address,
  onChange,
  error
}: ComplainantAddressFieldProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center mb-2">
        <Home className="h-5 w-5 text-primary mr-2" />
        <Label htmlFor="address" className="text-base">Endereço</Label>
      </div>
      <Input
        id="address"
        name="address"
        value={address}
        onChange={onChange}
        placeholder="Endereço do reclamante"
        className={`text-base ${error ? "border-destructive" : ""}`}
      />
      {error && (
        <p className="text-destructive text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default ComplainantAddressField;
