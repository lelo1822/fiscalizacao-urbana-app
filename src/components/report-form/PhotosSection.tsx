
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Camera, X } from "lucide-react";

interface PhotosSectionProps {
  photos: string[];
  setPhotos: React.Dispatch<React.SetStateAction<string[]>>;
  formErrors: { photos: string };
  setFormErrors: (prev: any) => void;
}

const PhotosSection = ({ photos, setPhotos, formErrors, setFormErrors }: PhotosSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
  
  return (
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
  );
};

export default PhotosSection;
