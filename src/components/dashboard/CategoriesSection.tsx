
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Category } from "@/types/dashboard";

interface CategoriesSectionProps {
  categories: Category[];
  onCategoryClick: (categoryName: string) => void;
}

const CategoriesSection = ({ categories, onCategoryClick }: CategoriesSectionProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Categorias de Ocorrências</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryClick(category.name)}
              className="flex flex-col items-center justify-center p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-secondary/50 transition-colors"
            >
              <span className="text-2xl mb-2">{category.icon}</span>
              <span className="text-sm font-medium text-center">{category.name}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoriesSection;
