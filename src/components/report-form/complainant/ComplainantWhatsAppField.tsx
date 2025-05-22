
import { Phone } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ComplainantWhatsAppFieldProps {
  whatsapp: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ComplainantWhatsAppField = ({
  whatsapp,
  onChange
}: ComplainantWhatsAppFieldProps) => {
  return (
    <div className="space-y-3 mb-6">
      <div className="flex items-center mb-2">
        <Phone className="h-5 w-5 text-primary mr-2" />
        <Label htmlFor="whatsapp" className="text-base">WhatsApp (opcional)</Label>
      </div>
      <Input
        id="whatsapp"
        name="whatsapp"
        value={whatsapp}
        onChange={onChange}
        placeholder="(XX) XXXXX-XXXX"
        className="text-base"
      />
      <p className="text-sm text-muted-foreground pt-1">
        Deixe em branco se for o mesmo que o telefone
      </p>
    </div>
  );
};

export default ComplainantWhatsAppField;
