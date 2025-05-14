
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DescriptionSectionProps {
  description: string;
  setDescription: (description: string) => void;
  formErrors: { description: string };
  setFormErrors: (prev: any) => void;
}

const DescriptionSection = ({ 
  description, 
  setDescription, 
  formErrors, 
  setFormErrors 
}: DescriptionSectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="description">Descrição</Label>
      <Textarea
        id="description"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          if (formErrors.description) {
            setFormErrors((prev) => ({ ...prev, description: "" }));
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
  );
};

export default DescriptionSection;
