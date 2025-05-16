
import React from 'react';

const ReportsLoadingState = () => {
  return (
    <div className="py-8 flex flex-col items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4" />
      <p className="text-muted-foreground">Carregando ocorrências...</p>
    </div>
  );
};

export default ReportsLoadingState;
