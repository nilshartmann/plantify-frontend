import { z } from "zod";

export const PlantType = z.enum([
  "SUMMER_FLOWERS",
  "PERENNIALS",
  "ROSES",
  "HERBS",
  "ORCHIDS",
  "INDOOR",
]);

export type PlantType = z.infer<typeof PlantType>;

export const NewPlantRequest = z.object({
  ownerId: z.uuid(),
  name: z.string().min(1),
  plantType: PlantType,
  location: z.string().min(1),
});

export type NewPlantRequest = z.infer<typeof NewPlantRequest>;

export const Plant = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  location: z.string().min(1),
  wateringInterval: z.number().min(1),
  lastWatered: z.string().optional(),
});

export type Plant = z.infer<typeof Plant>;

export const CareTaskType = z.enum([
  "WATERING",
  "FERTILIZING",
  "PRUNING",
  "REPOTTING",
  "PEST_CONTROL",
]);

export const CareTaskSource = z.enum(["SYSTEM", "EXPERT"]);

export const CareTask = z.object({
  id: z.uuid(),
  plantId: z.uuid(),
  type: CareTaskType,
  source: CareTaskSource,
  nextDueDate: z.string(), // ISO Date string
  recurring: z.boolean(),
  active: z.boolean(),
});

export type CareTask = z.infer<typeof CareTask>;
