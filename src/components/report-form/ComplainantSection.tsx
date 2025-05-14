
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
      <CardDescription className="mb-4">
        Informe os dados da pessoa que solicitou o registro desta ocorrência
      </CardDescription>
      
      {/* Complainant Name */}
      <div className="space-y-2">
        <div className="flex items-center">
          <User className="h-5 w-5 text-primary mr-2" />
          <Label htmlFor="fullName">Nome Completo</Label>
        </div>
        <Input
          id="fullName"
          name="fullName"
          value={complainant.fullName}
          onChange={handleComplainantChange}
          placeholder="Nome do reclamante"
          className={formErrors.complainantName ? "border-destructive" : ""}
        />
        {formErrors.complainantName && (
          <p className="text-destructive text-xs mt-1">{formErrors.complainantName}</p>
        )}
      </div>
      
      {/* Complainant Phone */}
      <div className="space-y-2">
        <div className="flex items-center">
          <Phone className="h-5 w-5 text-primary mr-2" />
          <Label htmlFor="phone">Telefone</Label>
        </div>
        <Input
          id="phone"
          name="phone"
          value={complainant.phone}
          onChange={handleComplainantChange}
          placeholder="(XX) XXXXX-XXXX"
          className={formErrors.complainantPhone ? "border-destructive" : ""}
        />
        {formErrors.complainantPhone && (
          <p className="text-destructive text-xs mt-1">{formErrors.complainantPhone}</p>
        )}
      </div>
      
      {/* Complainant WhatsApp */}
      <div className="space-y-2">
        <div className="flex items-center">
          <Phone className="h-5 w-5 text-primary mr-2" />
          <Label htmlFor="whatsapp">WhatsApp (opcional)</Label>
        </div>
        <Input
          id="whatsapp"
          name="whatsapp"
          value={complainant.whatsapp}
          onChange={handleComplainantChange}
          placeholder="(XX) XXXXX-XXXX"
        />
        <p className="text-xs text-muted-foreground">
          Deixe em branco se for o mesmo que o telefone
        </p>
      </div>
      
      {/* Complainant Address */}
      <div className="space-y-2">
        <div className="flex items-center">
          <Home className="h-5 w-5 text-primary mr-2" />
          <Label htmlFor="address">Endereço</Label>
        </div>
        <Input
          id="address"
          name="address"
          value={complainant.address}
          onChange={handleComplainantChange}
          placeholder="Endereço do reclamante"
          className={formErrors.complainantAddress ? "border-destructive" : ""}
        />
        {formErrors.complainantAddress && (
          <p className="text-destructive text-xs mt-1">{formErrors.complainantAddress}</p>
        )}
      </div>
    </>
  );
};

export default ComplainantSection;
