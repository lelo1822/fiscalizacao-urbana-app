
import React from 'react';
import { CalendarRange, Search, RefreshCw, PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ReportsEmptyStateProps {
  onRefresh?: () => void;
  filterActive?: boolean;
}

const ReportsEmptyState = ({ onRefresh, filterActive = false }: ReportsEmptyStateProps) => {
  const navigate = useNavigate();

  return (
    <div className="py-8 text-center">
      <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto shadow-sm">
        <div className="flex justify-center mb-4">
          <div className="bg-gray-100 p-3 rounded-full">
            <CalendarRange className="h-12 w-12 text-gray-500" />
          </div>
        </div>
        <h3 className="text-lg font-medium mb-2">
          {filterActive 
            ? "Nenhuma ocorrência encontrada com estes filtros" 
            : "Nenhuma ocorrência registrada"}
        </h3>
        <p className="text-muted-foreground mb-6">
          {filterActive 
            ? "Tente ajustar os critérios de busca ou crie uma nova ocorrência."
            : "Comece registrando sua primeira ocorrência urbana no sistema."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {filterActive && (
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => navigate('/reports')}
            >
              <Search className="h-4 w-4" />
              <span>Limpar filtros</span>
            </Button>
          )}
          
          <Button
            variant="default"
            className="flex items-center gap-2"
            onClick={() => navigate('/report/new')}
          >
            <PlusCircle className="h-4 w-4" />
            <span>Nova ocorrência</span>
          </Button>
          
          {onRefresh && (
            <Button
              variant={filterActive ? "outline" : "default"}
              className="flex items-center gap-2"
              onClick={onRefresh}
            >
              <RefreshCw className="h-4 w-4" />
              <span>Atualizar</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsEmptyState;
