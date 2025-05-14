
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface SubmitButtonProps {
  isSubmitting: boolean;
  disabled: boolean;
}

const SubmitButton = ({ isSubmitting, disabled }: SubmitButtonProps) => {
  return (
    <div className="pt-4">
      <Button 
        type="submit"
        className="w-full bg-primary"
        disabled={isSubmitting || disabled}
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
  );
};

export default SubmitButton;
