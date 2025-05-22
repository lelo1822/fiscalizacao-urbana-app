
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/dashboard";

interface QuickReportSectionProps {
  categories: Category[];
  onCategorySelect: (categoryName: string) => void;
  isLoading: boolean;
}

const QuickReportSection = ({ categories = [], onCategorySelect, isLoading }: QuickReportSectionProps) => {
  if (!categories || categories.length === 0) {
    return (
      <Card className="mb-6 hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle>Registrar ocorrência rápida</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-4">
            Nenhuma categoria disponível.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle>Registrar ocorrência rápida</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="outline"
              className="h-auto py-4 flex flex-col items-center justify-center transition-all duration-200 hover:border-primary hover:text-primary"
              onClick={() => onCategorySelect(category.name)}
              disabled={isLoading}
            >
              <span className="text-2xl mb-2">{category.icon}</span>
              <span className="text-sm text-center">{category.name}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickReportSection;
