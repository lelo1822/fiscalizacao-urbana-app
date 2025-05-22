
import { Phone } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ComplainantPhoneFieldProps {
  phone: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const ComplainantPhoneField = ({
  phone,
  onChange,
  error
}: ComplainantPhoneFieldProps) => {
  return (
    <div className="space-y-3 mb-6">
      <div className="flex items-center mb-2">
        <Phone className="h-5 w-5 text-primary mr-2" />
        <Label htmlFor="phone" className="text-base">Telefone</Label>
      </div>
      <Input
        id="phone"
        name="phone"
        value={phone}
        onChange={onChange}
        placeholder="(XX) XXXXX-XXXX"
        className={`text-base ${error ? "border-destructive" : ""}`}
      />
      {error && (
        <p className="text-destructive text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default ComplainantPhoneField;
