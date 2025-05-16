
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "@/schemas/settings-schema";

interface MapSettingsProps {
  form: UseFormReturn<SettingsFormValues>;
}

const MapSettings: React.FC<MapSettingsProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Mapa</CardTitle>
        <CardDescription>
          Personalize a aparência e funcionamento dos mapas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="mapType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Mapa</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de mapa" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="map">Padrão</SelectItem>
                  <SelectItem value="satellite">Satélite</SelectItem>
                  <SelectItem value="hybrid">Híbrido</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default MapSettings;
