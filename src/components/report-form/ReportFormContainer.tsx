
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import FormTabs from "./FormTabs";
import SubmitButton from "./SubmitButton";
import { useReportForm } from "@/hooks/useReportForm";

// Define the constant issue types
const ISSUE_TYPES = [
  "Buraco na via",
  "Poda de árvore",
  "Lâmpada queimada",
  "Lixo/Entulho",
  "Esgoto/Vazamento",
  "Sinalização",
  "Calçada danificada",
  "Outro"
];

const ReportFormContainer = () => {
  const isMobile = useIsMobile();
  const {
    issueType,
    setIssueType,
    description,
    setDescription,
    address,
    handleAddressChange,
    photos,
    setPhotos,
    isSubmitting,
    complainant,
    handleComplainantChange,
    formErrors,
    setFormErrors,
    handleSubmit,
  } = useReportForm();

  return (
    <div className={`${isMobile ? "p-2" : "p-4 md:p-8"}`}>
      <Card>
        <CardHeader>
          <CardTitle className={`${isMobile ? "text-xl" : "text-2xl"} mb-1`}>Registrar Nova Ocorrência</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormTabs 
              issueType={issueType}
              setIssueType={setIssueType}
              description={description}
              setDescription={setDescription}
              address={address}
              setAddress={handleAddressChange}
              photos={photos}
              setPhotos={setPhotos}
              complainant={complainant}
              handleComplainantChange={handleComplainantChange}
              formErrors={formErrors}
              setFormErrors={setFormErrors}
              ISSUE_TYPES={ISSUE_TYPES}
            />

            {/* Submit Button */}
            <SubmitButton 
              isSubmitting={isSubmitting} 
              disabled={photos.length === 0}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportFormContainer;
