
import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, MapPin, X, Check } from "lucide-react";
import { toast } from "sonner";
import LocationTracker from "@/components/LocationTracker";

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

  // Get current location when component mounts
  useState(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          
          // In a real app, you would use reverse geocoding here
          // For demo purposes, we'll just set a mock address
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
          }
        }
      };
      
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!issueType) {
      toast.error("Selecione o tipo de ocorrência");
      return;
    }
    
    if (!description) {
      toast.error("Adicione uma descrição para a ocorrência");
      return;
    }
    
    if (photos.length === 0) {
      toast.error("Adicione pelo menos uma foto da ocorrência");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would send data to a server here
      // Simulating API call
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
                  onValueChange={setIssueType}
                >
                  <SelectTrigger>
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
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva detalhadamente a ocorrência..."
                  rows={3}
                  required
                />
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
                {photos.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Adicione pelo menos uma foto da ocorrência.
                  </p>
                )}
              </div>

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
