
import React from 'react';
import { type Resolution } from '@/types/dashboard';
import { CheckCircle } from 'lucide-react';
import { format, parseISO, formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReportResolutionSummaryProps {
  resolution: Resolution;
  compact?: boolean;
}

const ReportResolutionSummary = ({ resolution, compact = false }: ReportResolutionSummaryProps) => {
  if (!resolution) return null;
  
  const resolutionDate = parseISO(resolution.date);
  const timeAgo = formatDistance(resolutionDate, new Date(), { 
    addSuffix: true,
    locale: ptBR 
  });
  
  if (compact) {
    return (
      <div className="flex items-center text-green-700 text-sm">
        <CheckCircle className="h-4 w-4 mr-1" />
        <span>Resolvido {timeAgo}</span>
      </div>
    );
  }
  
  return (
    <div className="bg-green-50 border border-green-100 rounded px-3 py-2 mt-2">
      <div className="flex items-center text-green-700 text-sm">
        <CheckCircle className="h-4 w-4 mr-1" />
        <span className="font-medium">Resolvido {timeAgo}</span>
      </div>
      <p className="text-xs text-green-600 mt-1 line-clamp-2">
        {resolution.description}
      </p>
    </div>
  );
};

export default ReportResolutionSummary;
