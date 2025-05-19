
import React from 'react';
import { CalendarCheck, User } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { type Resolution } from '@/types/dashboard';

interface ReportResolutionStatusProps {
  resolution: Resolution;
}

const ReportResolutionStatus = ({ resolution }: ReportResolutionStatusProps) => {
  const formattedDate = resolution.date ? 
    format(parseISO(resolution.date), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR }) : 
    'Data não disponível';

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
      <h3 className="font-medium text-green-800 flex items-center mb-2">
        <CalendarCheck className="h-5 w-5 mr-2" />
        Resolução da Ocorrência
      </h3>
      
      <div className="text-sm text-green-700 mb-2">
        <span className="font-medium">Data de resolução:</span> {formattedDate}
      </div>
      
      <div className="text-sm text-green-700 mb-2">
        <span className="font-medium">Responsável:</span> {resolution.responsible}
      </div>
      
      <div className="text-sm text-green-700">
        <span className="font-medium">Descrição:</span> {resolution.description}
      </div>
    </div>
  );
};

export default ReportResolutionStatus;
