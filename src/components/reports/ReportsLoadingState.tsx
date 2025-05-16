
import React from 'react';
import { Loader } from 'lucide-react';

const ReportsLoadingState = () => {
  return (
    <div className="py-8 flex flex-col items-center justify-center">
      <div className="bg-gray-50 rounded-lg p-6 w-full max-w-sm">
        <div className="flex flex-col items-center">
          <Loader className="h-10 w-10 text-primary animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Carregando ocorrências...</p>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Estamos buscando as informações mais recentes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportsLoadingState;
