
import * as z from "zod";

export const settingsSchema = z.object({
  notifications: z.boolean().default(true),
  dataUsage: z.enum(["low", "medium", "high"]).default("medium"),
  darkMode: z.boolean().default(false),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;

export const defaultSettings: SettingsFormValues = {
  notifications: true,
  dataUsage: "medium",
  darkMode: false,
};
