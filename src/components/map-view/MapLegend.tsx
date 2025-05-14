
import React from "react";

const MapLegend = () => {
  return (
    <div className="absolute bottom-4 left-4 p-3 bg-white rounded-md shadow-md">
      <h3 className="font-medium mb-2">Legenda</h3>
      <div className="space-y-1 text-sm">
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3" style={{ color: '#6a11cb' }}>
            <svg width="14" height="20" viewBox="0 0 100 150">
              <path d="M50 0C29.86 0 13.5 16.36 13.5 36.5C13.5 65.06 50 100 50 100s36.5-34.94 36.5-63.5C86.5 16.36 70.14 0 50 0z" 
                    fill="currentColor" stroke="white" strokeWidth="5"/>
              <circle cx="50" cy="36.5" r="13.5" fill="white"/>
            </svg>
          </span>
          <span>Pendentes</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3" style={{ color: '#8a4baf' }}>
            <svg width="14" height="20" viewBox="0 0 100 150">
              <path d="M50 0C29.86 0 13.5 16.36 13.5 36.5C13.5 65.06 50 100 50 100s36.5-34.94 36.5-63.5C86.5 16.36 70.14 0 50 0z" 
                    fill="currentColor" stroke="white" strokeWidth="5"/>
              <circle cx="50" cy="36.5" r="13.5" fill="white"/>
            </svg>
          </span>
          <span>Em andamento</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3" style={{ color: '#2575fc' }}>
            <svg width="14" height="20" viewBox="0 0 100 150">
              <path d="M50 0C29.86 0 13.5 16.36 13.5 36.5C13.5 65.06 50 100 50 100s36.5-34.94 36.5-63.5C86.5 16.36 70.14 0 50 0z" 
                    fill="currentColor" stroke="white" strokeWidth="5"/>
              <circle cx="50" cy="36.5" r="13.5" fill="white"/>
            </svg>
          </span>
          <span>Resolvidas</span>
        </div>
      </div>
    </div>
  );
};

export default MapLegend;
