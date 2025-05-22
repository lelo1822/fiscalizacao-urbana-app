
import { User, Phone, Home } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Complainant } from "@/types/complainant";
import { CardDescription } from "@/components/ui/card";

interface ComplainantSectionProps {
  complainant: Complainant;
  handleComplainantChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formErrors: {
    complainantName: string;
    complainantPhone: string;
    complainantAddress: string;
  };
}

const ComplainantSection = ({
  complainant,
  handleComplainantChange,
  formErrors,
}: ComplainantSectionProps) => {
  return (
    <>
      <CardDescription className="mb-6 text-base">
        Informe os dados da pessoa que solicitou o registro desta ocorrência
      </CardDescription>
      
      {/* Complainant Name */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center mb-2">
          <User className="h-5 w-5 text-primary mr-2" />
          <Label htmlFor="fullName" className="text-base">Nome Completo</Label>
        </div>
        <Input
          id="fullName"
          name="fullName"
          value={complainant.fullName}
          onChange={handleComplainantChange}
          placeholder="Nome do reclamante"
          className={`text-base ${formErrors.complainantName ? "border-destructive" : ""}`}
        />
        {formErrors.complainantName && (
          <p className="text-destructive text-xs mt-1">{formErrors.complainantName}</p>
        )}
      </div>
      
      {/* Complainant Phone */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center mb-2">
          <Phone className="h-5 w-5 text-primary mr-2" />
          <Label htmlFor="phone" className="text-base">Telefone</Label>
        </div>
        <Input
          id="phone"
          name="phone"
          value={complainant.phone}
          onChange={handleComplainantChange}
          placeholder="(XX) XXXXX-XXXX"
          className={`text-base ${formErrors.complainantPhone ? "border-destructive" : ""}`}
        />
        {formErrors.complainantPhone && (
          <p className="text-destructive text-xs mt-1">{formErrors.complainantPhone}</p>
        )}
      </div>
      
      {/* Complainant WhatsApp */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center mb-2">
          <Phone className="h-5 w-5 text-primary mr-2" />
          <Label htmlFor="whatsapp" className="text-base">WhatsApp (opcional)</Label>
        </div>
        <Input
          id="whatsapp"
          name="whatsapp"
          value={complainant.whatsapp}
          onChange={handleComplainantChange}
          placeholder="(XX) XXXXX-XXXX"
          className="text-base"
        />
        <p className="text-sm text-muted-foreground pt-1">
          Deixe em branco se for o mesmo que o telefone
        </p>
      </div>
      
      {/* Complainant Address */}
      <div className="space-y-3">
        <div className="flex items-center mb-2">
          <Home className="h-5 w-5 text-primary mr-2" />
          <Label htmlFor="address" className="text-base">Endereço</Label>
        </div>
        <Input
          id="address"
          name="address"
          value={complainant.address}
          onChange={handleComplainantChange}
          placeholder="Endereço do reclamante"
          className={`text-base ${formErrors.complainantAddress ? "border-destructive" : ""}`}
        />
        {formErrors.complainantAddress && (
          <p className="text-destructive text-xs mt-1">{formErrors.complainantAddress}</p>
        )}
      </div>
    </>
  );
};

export default ComplainantSection;
