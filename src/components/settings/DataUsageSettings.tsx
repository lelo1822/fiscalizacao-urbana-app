
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormDescription, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "@/schemas/settings-schema";

interface DataUsageSettingsProps {
  form: UseFormReturn<SettingsFormValues>;
}

const DataUsageSettings: React.FC<DataUsageSettingsProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Uso de Dados</CardTitle>
        <CardDescription>
          Controle o consumo de dados do aplicativo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="dataUsage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modo de Uso de Dados</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o modo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">Econômico (Baixa qualidade)</SelectItem>
                  <SelectItem value="medium">Balanceado</SelectItem>
                  <SelectItem value="high">Alta Qualidade</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Reduzir a qualidade economiza dados móveis
              </FormDescription>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default DataUsageSettings;
