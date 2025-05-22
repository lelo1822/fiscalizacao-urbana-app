
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "@/schemas/settings-schema";

// Create an empty component since we've removed location settings from the schema
const LocationSettings = ({ form }: { form: UseFormReturn<SettingsFormValues> }) => {
  return null;
};

export default LocationSettings;
