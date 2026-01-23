import { z } from "zod/v4"; // <-- auf "/v4" achten!
//
// export type Plant = {
//   id: string;
//   name: string;
//   location: string;
//   wateringInterval: number;
//   lastWatered?: string;
// };

export const Plant = z.object({
  // id wäre vermutlich auch nonempty, aber die
  // vergeben wir eh nicht selbst
  id: z.string(),
  name: z.string().nonempty(),
  location: z.string().nonempty(),
  wateringInterval: z.number().min(1),
  lastWatered: z.iso.date().optional(),
});

export type Plant = z.infer<typeof Plant>;
