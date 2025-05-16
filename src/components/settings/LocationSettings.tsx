
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormDescription, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "@/schemas/settings-schema";

interface LocationSettingsProps {
  form: UseFormReturn<SettingsFormValues>;
}

const LocationSettings: React.FC<LocationSettingsProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Localização e Rastreamento</CardTitle>
        <CardDescription>
          Gerencie como o aplicativo utiliza sua localização
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="trackLocation"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>Rastreamento de Localização</FormLabel>
                <FormDescription>
                  Permite ao aplicativo rastrear sua localização em segundo plano
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="updateInterval"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Intervalo de Atualização</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o intervalo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="30">A cada 30 segundos</SelectItem>
                  <SelectItem value="300">A cada 5 minutos</SelectItem>
                  <SelectItem value="600">A cada 10 minutos</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Quanto mais frequente o rastreamento, maior o consumo de bateria
              </FormDescription>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default LocationSettings;
