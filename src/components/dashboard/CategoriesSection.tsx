
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/dashboard";

interface CategoriesSectionProps {
  categories: Category[];
  onCategoryClick: (categoryName: string) => void;
}

const CategoriesSection = ({ categories, onCategoryClick }: CategoriesSectionProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle>Categorias de Ocorrências</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="outline"
              className="h-auto py-3 flex flex-col items-center justify-center gap-2"
              onClick={() => onCategoryClick(category.name)}
            >
              <span className="text-2xl">{category.icon}</span>
              <span className="text-xs text-center">{category.name}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoriesSection;
