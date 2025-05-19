
import React from 'react';
import { Loader } from 'lucide-react';

const ReportsLoadingState = () => {
  return (
    <div className="py-8 flex flex-col items-center justify-center">
      <div className="bg-gray-50 rounded-lg p-6 w-full max-w-md shadow-sm">
        <div className="flex flex-col items-center">
          <Loader className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-gray-700 font-medium text-lg">Carregando ocorrências...</p>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Estamos buscando as informações mais recentes do banco de dados.
          </p>
          <div className="mt-4 w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full animate-pulse" style={{width: '70%'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsLoadingState;
