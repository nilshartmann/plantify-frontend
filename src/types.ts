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
  ownerId: z.string(),
  name: z.string().min(1),
  plantType: PlantType,
  location: z.string().min(1),
});

export type NewPlantRequest = z.infer<typeof NewPlantRequest>;

export const PlantDto = z.object({
  id: z.string(),
  ownerId: z.string(),
  name: z.string().min(1),
  location: z.string().min(1),
});

export type PlantDto = z.infer<typeof PlantDto>;

export const CareTaskType = z.enum([
  "WATERING",
  "FERTILIZING",
  "PRUNING",
  "REPOTTING",
  "PEST_CONTROL",
]);

export const CareTaskSource = z.enum(["SYSTEM", "EXPERT"]);

export const CareTaskDto = z.object({
  id: z.string(),
  plantId: z.string(),
  type: CareTaskType,
  source: CareTaskSource,
  nextDueDate: z.string(), // ISO Date string
  recurring: z.boolean(),
  interval: z.number().nullable().optional(),
  active: z.boolean(),
});

export type CareTaskDto = z.infer<typeof CareTaskDto>;

export const OwnerDto = z.object({
  id: z.string(),
  name: z.string().min(1),
});

export type OwnerDto = z.infer<typeof OwnerDto>;
