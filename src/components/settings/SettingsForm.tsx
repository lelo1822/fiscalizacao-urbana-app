
import React, { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { settingsSchema, SettingsFormValues, defaultSettings } from "@/schemas/settings-schema";
import NotificationSettings from "./NotificationSettings";
import DataUsageSettings from "./DataUsageSettings";
import AppearanceSettings from "./AppearanceSettings";

const SettingsForm = () => {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: defaultSettings,
  });

  const onSubmit = async (data: SettingsFormValues) => {
    setIsSaving(true);
    
    // Simulando um salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Em uma aplicação real, enviaríamos para um servidor
    console.log('Configurações salvas:', data);
    localStorage.setItem('appSettings', JSON.stringify(data));
    
    toast.success("Configurações salvas com sucesso!");
    setIsSaving(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <NotificationSettings form={form} />
        <DataUsageSettings form={form} />
        <AppearanceSettings form={form} />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={() => form.reset()}>
            Resetar
          </Button>
          <Button type="submit" disabled={isSaving} className="bg-primary">
            {isSaving ? (
              <>
                <span className="h-4 w-4 border-2 border-white border-opacity-25 border-t-white rounded-full animate-spin mr-2"></span>
                Salvando...
              </>
            ) : "Salvar Configurações"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SettingsForm;
