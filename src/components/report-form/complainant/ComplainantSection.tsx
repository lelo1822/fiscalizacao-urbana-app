
import { CardDescription } from "@/components/ui/card";
import { Complainant } from "@/types/complainant";
import ComplainantNameField from "./ComplainantNameField";
import ComplainantPhoneField from "./ComplainantPhoneField";
import ComplainantWhatsAppField from "./ComplainantWhatsAppField";
import ComplainantAddressField from "./ComplainantAddressField";

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
      
      <ComplainantNameField 
        fullName={complainant.fullName}
        onChange={handleComplainantChange}
        error={formErrors.complainantName}
      />
      
      <ComplainantPhoneField
        phone={complainant.phone}
        onChange={handleComplainantChange}
        error={formErrors.complainantPhone}
      />
      
      <ComplainantWhatsAppField
        whatsapp={complainant.whatsapp}
        onChange={handleComplainantChange}
      />
      
      <ComplainantAddressField
        address={complainant.address}
        onChange={handleComplainantChange}
        error={formErrors.complainantAddress}
      />
    </>
  );
};

export default ComplainantSection;
