
import React, { ReactNode } from "react";

interface BaseHeaderProps {
  title: string;
  description?: string | ReactNode;
  actions?: ReactNode;
  className?: string;
}

const BaseHeader = ({ title, description, actions, className = "" }: BaseHeaderProps) => {
  return (
    <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 ${className}`}>
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {title}
        </h1>
        {description && (
          <p className="text-gray-500 text-sm md:text-base">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="w-full sm:w-auto flex flex-wrap gap-2">
          {actions}
        </div>
      )}
    </div>
  );
};

export default BaseHeader;
