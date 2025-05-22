
import { User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ComplainantNameFieldProps {
  fullName: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const ComplainantNameField = ({
  fullName,
  onChange,
  error
}: ComplainantNameFieldProps) => {
  return (
    <div className="space-y-3 mb-6">
      <div className="flex items-center mb-2">
        <User className="h-5 w-5 text-primary mr-2" />
        <Label htmlFor="fullName" className="text-base">Nome Completo</Label>
      </div>
      <Input
        id="fullName"
        name="fullName"
        value={fullName}
        onChange={onChange}
        placeholder="Nome do reclamante"
        className={`text-base ${error ? "border-destructive" : ""}`}
      />
      {error && (
        <p className="text-destructive text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default ComplainantNameField;
