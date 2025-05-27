
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { GABINETES } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

// Images for vereadores (all images alphabetically ordered by name)
const VEREADORES = [
  { id: "1", nome: "Alexandre Capriotti", partido: "PL", imageUrl: "/lovable-uploads/5674c5ed-4a7f-4611-99aa-697285ce6581.png" },
  { id: "2", nome: "Carmônio Bastos", partido: "PODE", imageUrl: "/lovable-uploads/5edce2e4-6775-440f-b324-a8ff50e6d3ee.png" },
  { id: "3", nome: "Cantor Goleiro", partido: "UNIÃO", imageUrl: "/lovable-uploads/f5e1be97-6555-48ae-811e-0b3a43b38485.png" },
  { id: "4", nome: "Délbio Teruel", partido: "UNIÃO", imageUrl: "/lovable-uploads/1690862c-9211-430a-b726-2ba652a8f4ed.png" },
  { id: "5", nome: "Elania Silva", partido: "PSD", imageUrl: "/lovable-uploads/81d3c503-2b0a-496e-9b14-f865c990b380.png" },
  { id: "6", nome: "Elsa Oliveira", partido: "PODE", imageUrl: "/lovable-uploads/90c13f6b-1b1e-4b28-9949-bc82a7b68545.png" },
  { id: "7", nome: "Emerson Osasco", partido: "PCdoB", imageUrl: "/lovable-uploads/a17d0e5a-ad3a-4590-8dbd-5ca73cbc0022.png" },
  { id: "8", nome: "Fábio Chirinhan", partido: "PRD", imageUrl: "/lovable-uploads/a2a6cc1e-ff45-420d-baa8-e379dabf7036.png" },
  { id: "9", nome: "Gabriel Saúde", partido: "AGIR", imageUrl: "/lovable-uploads/e5e78423-d9ce-4a8c-8f1d-eb3e3dfff32f.png" },
  { id: "10", nome: "Guiga", partido: "AVANTE", imageUrl: "/lovable-uploads/da59026c-3b01-477a-b038-48ea169220c6.png" },
  { id: "11", nome: "Guilherme Prado", partido: "PRD", imageUrl: "/lovable-uploads/8d77a69c-0c63-43ba-b813-e777a89bf912.png" },
  { id: "12", nome: "Heber do JuntOz", partido: "PT", imageUrl: "/lovable-uploads/55ed6409-639c-44d6-90b0-df0f98630fc2.png" },
  { id: "13", nome: "Josias da Juco", partido: "PSD", imageUrl: "/lovable-uploads/2a55c2f6-db24-4e67-bb32-477446b0f628.png" },
  { id: "14", nome: "Laércio Mendonça", partido: "PDT", imageUrl: "/lovable-uploads/8da74773-e485-438c-a144-a233ecf78786.png" },
  { id: "15", nome: "Paulo Junior", partido: "PRD", imageUrl: "/lovable-uploads/427f5182-a2a5-4637-b0c7-c7426a982331.png" },
  { id: "16", nome: "Pedrinho Cantagessi", partido: "UNIÃO", imageUrl: "/lovable-uploads/b2c573ac-f83d-4b5c-9a14-4e2ce38a788a.png" },
  { id: "17", nome: "Ralfi Silva", partido: "REPUBL", imageUrl: "/lovable-uploads/081a607d-4422-4316-be1d-196d7b74ea65.png" },
  { id: "18", nome: "Rodolfo Cara", partido: "PODE", imageUrl: "/lovable-uploads/bc779ba6-d341-4c16-8535-75ae77b52e41.png" },
  { id: "19", nome: "Rodrigo Gansinho", partido: "PL", imageUrl: "/lovable-uploads/a0bba4a4-81ec-45e5-b0f3-b114b7afbb04.png" },
  { id: "20", nome: "Sergio Fontellas", partido: "REPUBL", imageUrl: "/lovable-uploads/b6642b14-c66e-4e02-99c7-8ff4ce4d053e.png" },
  { id: "21", nome: "Stephane Rossi", partido: "PL", imageUrl: "/lovable-uploads/c6c330dd-fbdf-4aad-ad30-eb58b4d6613f.png" },
].sort((a, b) => a.nome.localeCompare(b.nome)); // Sort alphabetically by name

interface CouncilorSelectProps {
  selectedGabineteId: string;
  onChange: (gabineteId: string) => void;
  formError: string;
}

const CouncilorSelect = ({ selectedGabineteId, onChange, formError }: CouncilorSelectProps) => {
  // Map gabinete IDs to vereador data
  const getVereadorByGabineteId = (gabineteId: string) => {
    const index = parseInt(gabineteId) - 1;
    if (index >= 0 && index < VEREADORES.length) {
      return VEREADORES[index];
    }
    return null;
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="gabinete">Selecione um Vereador</Label>
      
      {formError && (
        <p className="text-destructive text-xs mb-2">{formError}</p>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[400px] overflow-y-auto p-1">
        {VEREADORES.map((vereador) => {
          const isSelected = selectedGabineteId === vereador.id;
          
          return (
            <Card 
              key={vereador.id}
              className={`p-2 cursor-pointer hover:bg-accent/50 transition-colors ${
                isSelected ? 'bg-primary/10 border-primary' : ''
              }`}
              onClick={() => onChange(vereador.id)}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-2 border-muted">
                    <AvatarImage 
                      src={vereador.imageUrl} 
                      alt={vereador.nome}
                      className="object-cover" 
                    />
                    <AvatarFallback>{vereador.nome.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 bg-primary text-white rounded-full p-1">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium line-clamp-1">{vereador.nome}</p>
                  <p className="text-xs text-muted-foreground">{vereador.partido}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CouncilorSelect;
