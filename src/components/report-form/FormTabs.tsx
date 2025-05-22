
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import LocationSection from "./LocationSection";
import IssueTypeSection from "./IssueTypeSection";
import DescriptionSection from "./DescriptionSection";
import PhotosSection from "./PhotosSection";
import ComplainantSection from "./complainant/ComplainantSection";
import { Complainant } from "@/types/complainant";
import { FormErrors } from "@/types/form";

interface FormTabsProps {
  issueType: string;
  setIssueType: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  photos: string[];
  setPhotos: React.Dispatch<React.SetStateAction<string[]>>;
  complainant: Complainant;
  handleComplainantChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formErrors: FormErrors;
  setFormErrors: (prev: any) => void;
  ISSUE_TYPES: string[];
}

const FormTabs = ({
  issueType,
  setIssueType,
  description,
  setDescription,
  address,
  setAddress,
  photos,
  setPhotos,
  complainant,
  handleComplainantChange,
  formErrors,
  setFormErrors,
  ISSUE_TYPES,
}: FormTabsProps) => {
  const isMobile = useIsMobile();

  return (
    <Tabs defaultValue="occurrence" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="occurrence" className={`py-2 ${isMobile ? "text-sm" : ""}`}>Ocorrência</TabsTrigger>
        <TabsTrigger value="complainant" className={`py-2 ${isMobile ? "text-sm" : ""}`}>Dados do Reclamante</TabsTrigger>
      </TabsList>
      
      <TabsContent value="occurrence" className="space-y-6 pt-4">
        {/* Location Section */}
        <LocationSection 
          address={address}
          setAddress={setAddress}
        />

        {/* Issue Type Section */}
        <IssueTypeSection
          issueType={issueType}
          setIssueType={setIssueType}
          formErrors={{ issueType: formErrors.issueType }}
          setFormErrors={setFormErrors}
          ISSUE_TYPES={ISSUE_TYPES}
        />

        {/* Description Section */}
        <DescriptionSection
          description={description}
          setDescription={setDescription}
          formErrors={{ description: formErrors.description }}
          setFormErrors={setFormErrors}
        />

        {/* Photos Section */}
        <PhotosSection
          photos={photos}
          setPhotos={setPhotos}
          formErrors={{ photos: formErrors.photos }}
          setFormErrors={setFormErrors}
        />
      </TabsContent>
      
      <TabsContent value="complainant" className="space-y-6 pt-4">
        <ComplainantSection
          complainant={complainant}
          handleComplainantChange={handleComplainantChange}
          formErrors={{
            complainantName: formErrors.complainantName,
            complainantPhone: formErrors.complainantPhone,
            complainantAddress: formErrors.complainantAddress
          }}
        />
      </TabsContent>
    </Tabs>
  );
};

export default FormTabs;
