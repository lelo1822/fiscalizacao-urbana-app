
import React, { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface BaseHeaderProps {
  title: string;
  description?: string | ReactNode;
  actions?: ReactNode;
  className?: string;
}

const BaseHeader = ({ title, description, actions, className = "" }: BaseHeaderProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`flex flex-col ${isMobile ? "gap-4" : "sm:flex-row"} justify-between items-start sm:items-center mb-6 md:mb-6 gap-3 md:gap-4 ${className}`}>
      <div>
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
          {title}
        </h1>
        {description && (
          <p className="text-sm md:text-base text-gray-500">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className={`${isMobile ? "w-full mt-2" : "w-auto"} flex flex-wrap gap-2`}>
          {actions}
        </div>
      )}
    </div>
  );
};

export default BaseHeader;
