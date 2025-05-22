
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Category } from "@/types/dashboard";
import { useIsMobile } from "@/hooks/use-mobile";

interface CategoriesSectionProps {
  categories: Category[];
  onCategoryClick: (categoryName: string) => void;
}

const CategoriesSection = ({ categories, onCategoryClick }: CategoriesSectionProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Card>
      <CardHeader className={`${isMobile ? "px-4 py-3" : "pb-3"}`}>
        <CardTitle>Categorias de Ocorrências</CardTitle>
      </CardHeader>
      <CardContent className={isMobile ? "px-3 py-2" : ""}>
        <div className="grid grid-cols-2 gap-2 md:gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryClick(category.name)}
              className="flex flex-col items-center justify-center p-2 md:p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-secondary/50 transition-colors"
            >
              <span className="text-xl md:text-2xl mb-1 md:mb-2">{category.icon}</span>
              <span className="text-xs md:text-sm font-medium text-center">{category.name}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoriesSection;
