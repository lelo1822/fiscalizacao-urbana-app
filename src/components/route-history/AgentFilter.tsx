
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface AgentFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const AgentFilter = ({ value, onChange }: AgentFilterProps) => {
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="agentFilter">Agente:</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="agentFilter" className="w-[180px]">
          <SelectValue placeholder="Todos os agentes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os agentes</SelectItem>
          <SelectItem value="current">Meu histórico</SelectItem>
          <SelectItem value="agent1">Agente Silva</SelectItem>
          <SelectItem value="agent2">Agente Oliveira</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default AgentFilter;
