
import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Camera, MapPin, X, Check, Phone, User, Mail, Home } from "lucide-react";
import { toast } from "sonner";
import LocationTracker from "@/components/LocationTracker";
import { Complainant } from "@/types/complainant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  // Obter localização atual quando o componente é montado
  useState(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          
          // Em um app real, você usaria geocodificação reversa aqui
          // Para fins de demonstração, vamos apenas definir um endereço simulado
          setAddress("Detectando endereço...");
          setTimeout(() => {
            setAddress("Av. Brasil, próximo ao número 1500");
          }, 1500);
        },
        (error) => {
          console.error("Erro ao obter localização:", error);
          toast.error("Não foi possível obter sua localização atual");
        }
      );
    } else {
      toast.error("Geolocalização não é suportada pelo seu navegador");
    }
  });

  const handlePhotoCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const newPhotos: string[] = [];
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          newPhotos.push(e.target.result as string);
          if (newPhotos.length === files.length) {
            setPhotos(prevPhotos => [...prevPhotos, ...newPhotos]);
            // Limpar erro se houver
            if (formErrors.photos) {
              setFormErrors(prev => ({ ...prev, photos: "" }));
            }
          }
        }
      };
      
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };
  
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
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Em um app real, você enviaria os dados para um servidor aqui
      // Simulando chamada de API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Ocorrência registrada com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao enviar ocorrência:", error);
      toast.error("Erro ao registrar ocorrência. Tente novamente.");
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
                  {/* Location */}
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-primary mr-2" />
                      <Label>Localização</Label>
                    </div>
                    <div>
                      {currentLocation ? (
                        <div>
                          <div className="text-sm text-muted-foreground mb-2">
                            Coordenadas: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                          </div>
                          <Input 
                            value={address} 
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Endereço completo"
                            required
                          />
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          <span>Obtendo sua localização...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Issue Type */}
                  <div className="space-y-2">
                    <Label htmlFor="issueType">Tipo de Ocorrência</Label>
                    <Select 
                      value={issueType} 
                      onValueChange={(value) => {
                        setIssueType(value);
                        if (formErrors.issueType) {
                          setFormErrors(prev => ({ ...prev, issueType: "" }));
                        }
                      }}
                    >
                      <SelectTrigger className={formErrors.issueType ? "border-destructive" : ""}>
                        <SelectValue placeholder="Selecione o tipo de problema" />
                      </SelectTrigger>
                      <SelectContent>
                        {ISSUE_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.issueType && (
                      <p className="text-destructive text-xs mt-1">{formErrors.issueType}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        if (formErrors.description) {
                          setFormErrors(prev => ({ ...prev, description: "" }));
                        }
                      }}
                      placeholder="Descreva detalhadamente a ocorrência..."
                      rows={3}
                      className={formErrors.description ? "border-destructive" : ""}
                    />
                    {formErrors.description && (
                      <p className="text-destructive text-xs mt-1">{formErrors.description}</p>
                    )}
                  </div>

                  {/* Photos */}
                  <div className="space-y-2">
                    <Label>Fotos</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                          <img 
                            src={photo} 
                            alt={`Foto ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                          <Button 
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={() => removePhoto(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      
                      {photos.length < 4 && (
                        <Button
                          type="button"
                          variant="outline"
                          className="aspect-square flex flex-col items-center justify-center border-dashed"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Camera className="h-6 w-6 mb-1" />
                          <span className="text-xs">Adicionar Foto</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            ref={fileInputRef}
                            onChange={handlePhotoCapture}
                            className="hidden"
                            capture="environment"
                          />
                        </Button>
                      )}
                    </div>
                    {formErrors.photos && (
                      <p className="text-destructive text-xs mt-2">{formErrors.photos}</p>
                    )}
                    {photos.length === 0 && !formErrors.photos && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Adicione pelo menos uma foto da ocorrência.
                      </p>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="complainant" className="space-y-6 pt-4">
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
                </TabsContent>
              </Tabs>

              {/* Submit Button */}
              <div className="pt-4">
                <Button 
                  type="submit"
                  className="w-full bg-primary"
                  disabled={isSubmitting || !currentLocation || photos.length === 0}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-1">
                      <span className="h-4 w-4 border-2 border-white border-opacity-25 border-t-white rounded-full animate-spin"></span>
                      Enviando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Check className="h-4 w-4" />
                      Registrar Ocorrência
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <LocationTracker />
    </Layout>
  );
};

export default ReportForm;
