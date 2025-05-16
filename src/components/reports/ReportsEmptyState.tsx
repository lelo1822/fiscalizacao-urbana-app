
import React from 'react';
import { CalendarRange, Search, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ReportsEmptyStateProps {
  onRefresh?: () => void;
}

const ReportsEmptyState = ({ onRefresh }: ReportsEmptyStateProps) => {
  return (
    <div className="py-8 text-center">
      <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
        <div className="flex justify-center mb-4">
          <div className="bg-gray-100 p-3 rounded-full">
            <CalendarRange className="h-12 w-12 text-gray-500" />
          </div>
        </div>
        <h3 className="text-lg font-medium mb-2">Nenhuma ocorrência encontrada</h3>
        <p className="text-muted-foreground mb-6">
          Não encontramos nenhuma ocorrência com os filtros atuais.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => window.location.href = '/report/new'}
          >
            <Search className="h-4 w-4" />
            <span>Usar outros filtros</span>
          </Button>
          {onRefresh && (
            <Button
              variant="default"
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
