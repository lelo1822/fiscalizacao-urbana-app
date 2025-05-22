
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "@/schemas/settings-schema";

// Create an empty component since we've removed map settings from the schema
const MapSettings = ({ form }: { form: UseFormReturn<SettingsFormValues> }) => {
  return null;
};

export default MapSettings;
