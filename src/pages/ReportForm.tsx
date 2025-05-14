
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Complainant } from "@/types/complainant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import our components
import LocationSection from "@/components/report-form/LocationSection";
import IssueTypeSection from "@/components/report-form/IssueTypeSection";
import DescriptionSection from "@/components/report-form/DescriptionSection";
import PhotosSection from "@/components/report-form/PhotosSection";
import ComplainantSection from "@/components/report-form/ComplainantSection";
import SubmitButton from "@/components/report-form/SubmitButton";

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

interface LocationState {
  category?: string;
}

const ReportForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  
  const [issueType, setIssueType] = useState(state?.category || "");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado para informações do reclamante
  const [complainant, setComplainant] = useState<Complainant>({
    fullName: "",
    phone: "",
    whatsapp: "",
    address: ""
  });
  
  // Estado para erros de validação
  const [formErrors, setFormErrors] = useState({
    issueType: "",
    description: "",
    photos: "",
    complainantName: "",
    complainantPhone: "",
    complainantAddress: ""
  });

  const handleComplainantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setComplainant({...complainant, [name]: value});
    
    // Limpar erro se houver
    if (name === "fullName" && formErrors.complainantName) {
      setFormErrors(prev => ({ ...prev, complainantName: "" }));
    } else if (name === "phone" && formErrors.complainantPhone) {
      setFormErrors(prev => ({ ...prev, complainantPhone: "" }));
    } else if (name === "address" && formErrors.complainantAddress) {
      setFormErrors(prev => ({ ...prev, complainantAddress: "" }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...formErrors };
    
    if (!issueType) {
      newErrors.issueType = "Selecione o tipo de ocorrência";
      isValid = false;
    }
    
    if (!description) {
      newErrors.description = "Adicione uma descrição para a ocorrência";
      isValid = false;
    }
    
    if (photos.length === 0) {
      newErrors.photos = "Adicione pelo menos uma foto da ocorrência";
      isValid = false;
    }
    
    // Validar informações do reclamante
    if (!complainant.fullName) {
      newErrors.complainantName = "Nome do reclamante é obrigatório";
      isValid = false;
    }
    
    if (!complainant.phone) {
      newErrors.complainantPhone = "Telefone do reclamante é obrigatório";
      isValid = false;
    }
    
    if (!complainant.address) {
      newErrors.complainantAddress = "Endereço do reclamante é obrigatório";
      isValid = false;
    }
    
    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Preencha todos os campos obrigatórios"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Em um app real, você enviaria os dados para um servidor aqui
      // Simulando chamada de API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Sucesso",
        description: "Ocorrência registrada com sucesso!"
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao enviar ocorrência:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao registrar ocorrência. Tente novamente."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Registrar Nova Ocorrência</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="occurrence" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="occurrence">Ocorrência</TabsTrigger>
                  <TabsTrigger value="complainant">Dados do Reclamante</TabsTrigger>
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

              {/* Submit Button */}
              <SubmitButton 
                isSubmitting={isSubmitting} 
                disabled={photos.length === 0}
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ReportForm;
