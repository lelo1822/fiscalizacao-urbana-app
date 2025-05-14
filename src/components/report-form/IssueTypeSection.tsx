
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface IssueTypeSectionProps {
  issueType: string;
  setIssueType: (value: string) => void;
  formErrors: { issueType: string };
  setFormErrors: (prev: any) => void;
  ISSUE_TYPES: string[];
}

const IssueTypeSection = ({ 
  issueType, 
  setIssueType, 
  formErrors, 
  setFormErrors,
  ISSUE_TYPES
}: IssueTypeSectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="issueType">Tipo de Ocorrência</Label>
      <Select 
        value={issueType} 
        onValueChange={(value) => {
          setIssueType(value);
          if (formErrors.issueType) {
            setFormErrors((prev: any) => ({ ...prev, issueType: "" }));
          }
        }}
      >
        <SelectTrigger className={formErrors.issueType ? "border-destructive" : ""}>
          <SelectValue placeholder="Selecione o tipo de problema" />
        </SelectTrigger>
        <SelectContent>
          {ISSUE_TYPES.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {formErrors.issueType && (
        <p className="text-destructive text-xs mt-1">{formErrors.issueType}</p>
      )}
    </div>
  );
};

export default IssueTypeSection;
