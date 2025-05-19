
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from 'lucide-react';

interface ReportResolutionFormProps {
  onSubmit: (resolution: { description: string; responsible: string }) => void;
  isLoading?: boolean;
}

const ReportResolutionForm = ({ onSubmit, isLoading = false }: ReportResolutionFormProps) => {
  const [description, setDescription] = useState('');
  const [responsible, setResponsible] = useState('');
  const [errors, setErrors] = useState({ description: '', responsible: '' });

  const validateForm = () => {
    const newErrors = { description: '', responsible: '' };
    let isValid = true;
    
    if (!description.trim()) {
      newErrors.description = 'A descrição da resolução é obrigatória';
      isValid = false;
    }
    
    if (!responsible.trim()) {
      newErrors.responsible = 'O responsável pela resolução é obrigatório';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        description,
        responsible
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <h3 className="font-medium text-lg">Marcar como Resolvido</h3>
      
      <div className="space-y-2">
        <Label htmlFor="responsible">Responsável pela resolução</Label>
        <Input
          id="responsible"
          value={responsible}
          onChange={(e) => {
            setResponsible(e.target.value);
            if (errors.responsible) setErrors({...errors, responsible: ''});
          }}
          placeholder="Nome do responsável pela resolução"
          className={errors.responsible ? "border-destructive" : ""}
        />
        {errors.responsible && (
          <p className="text-destructive text-xs">{errors.responsible}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição da resolução</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) setErrors({...errors, description: ''});
          }}
          placeholder="Descreva como a ocorrência foi resolvida..."
          rows={3}
          className={errors.description ? "border-destructive" : ""}
        />
        {errors.description && (
          <p className="text-destructive text-xs">{errors.description}</p>
        )}
      </div>
      
      <Button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-1">
            <span className="h-4 w-4 border-2 border-white border-opacity-25 border-t-white rounded-full animate-spin"></span>
            Enviando...
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" />
            Confirmar Resolução
          </span>
        )}
      </Button>
    </form>
  );
};

export default ReportResolutionForm;
