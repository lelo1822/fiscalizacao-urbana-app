
import { useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import LocationTracker from "@/components/LocationTracker";

const settingsSchema = z.object({
  trackLocation: z.boolean().default(true),
  notifications: z.boolean().default(true),
  updateInterval: z.string().default("60"),
  mapType: z.enum(["map", "satellite", "hybrid"]).default("map"),
  dataUsage: z.enum(["low", "medium", "high"]).default("medium"),
  darkMode: z.boolean().default(false),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const Settings = () => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  // Dados de formulário padrão
  const defaultValues: SettingsFormValues = {
    trackLocation: true,
    notifications: true,
    updateInterval: "60",
    mapType: "map",
    dataUsage: "medium",
    darkMode: false,
  };

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues,
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
    <Layout>
      <div className="p-4 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Configurações
          </h1>
          <p className="text-gray-500">
            Personalize sua experiência no aplicativo
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Localization */}
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
                            <SelectItem value="60">A cada 1 minuto</SelectItem>
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

              {/* Map Settings */}
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

              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Notificações</CardTitle>
                  <CardDescription>
                    Personalize suas preferências de notificação
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="notifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel>Notificações Push</FormLabel>
                          <FormDescription>
                            Receba alertas sobre novas ocorrências e atualizações
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
                </CardContent>
              </Card>

              {/* Data Usage */}
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

              {/* Appearance */}
              <Card>
                <CardHeader>
                  <CardTitle>Aparência</CardTitle>
                  <CardDescription>
                    Personalize a aparência do aplicativo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="darkMode"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel>Modo Escuro</FormLabel>
                          <FormDescription>
                            Ativa o tema escuro do aplicativo
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
                </CardContent>
              </Card>

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
        </div>
      </div>
      <LocationTracker />
    </Layout>
  );
};

export default Settings;
