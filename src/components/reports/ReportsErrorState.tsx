
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ReportsErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ReportsErrorState = ({ 
  message = "Erro ao carregar os dados das ocorrências", 
  onRetry 
}: ReportsErrorStateProps) => {
  return (
    <div className="py-8 flex flex-col items-center justify-center">
      <div className="bg-red-50 rounded-lg p-6 w-full max-w-md shadow-sm border border-red-200">
        <div className="flex flex-col items-center">
          <div className="bg-red-100 p-3 rounded-full mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          
          <p className="text-red-700 font-medium text-lg text-center mb-2">
            {message}
          </p>
          
          <p className="text-sm text-red-600 mb-4 text-center">
            Verifique sua conexão com a internet ou tente novamente mais tarde.
          </p>
          
          {onRetry && (
            <Button 
              variant="outline" 
              className="border-red-300 text-red-700 hover:bg-red-50"
              onClick={onRetry}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsErrorState;
