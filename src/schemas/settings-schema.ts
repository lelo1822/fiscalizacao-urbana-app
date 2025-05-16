
import * as z from "zod";

export const settingsSchema = z.object({
  trackLocation: z.boolean().default(true),
  notifications: z.boolean().default(true),
  updateInterval: z.string().default("300"),
  mapType: z.enum(["map", "satellite", "hybrid"]).default("map"),
  dataUsage: z.enum(["low", "medium", "high"]).default("medium"),
  darkMode: z.boolean().default(false),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;

export const defaultSettings: SettingsFormValues = {
  trackLocation: true,
  notifications: true,
  updateInterval: "300",
  mapType: "map",
  dataUsage: "medium",
  darkMode: false,
};
