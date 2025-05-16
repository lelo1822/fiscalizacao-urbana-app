
import React from 'react';
import { CalendarRange } from 'lucide-react';

const ReportsEmptyState = () => {
  return (
    <div className="py-8 text-center">
      <div className="flex justify-center mb-4">
        <CalendarRange className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">Nenhuma ocorrência encontrada</h3>
      <p className="text-muted-foreground">
        Tente ajustar seus filtros ou realizar uma pesquisa diferente.
      </p>
    </div>
  );
};

export default ReportsEmptyState;
