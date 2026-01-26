import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import ky from "ky";

import { CareTask, NewPlantRequest, Plant } from "./types";

export const plantQueries = {
  all: () => ["plants"] as const,
  lists: () => [...plantQueries.all(), "list"] as const,
  list: () =>
    queryOptions({
      queryKey: plantQueries.lists(),
      queryFn: async () => {
        const response = await ky.get("/api/plants").json();
        return Plant.array().parse(response);
      },
      retry: false,
    }),
};

export const careTaskQueries = {
  all: () => ["care-tasks"] as const,
  list: () =>
    queryOptions({
      queryKey: careTaskQueries.all(),
      queryFn: async () => {
        const response = await ky.get("/api/care-tasks").json();
        return CareTask.array().parse(response);
      },
    }),
};

export function useAddPlantMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPlant: NewPlantRequest) => {
      await ky.post("/api/plants", { json: newPlant }).json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plantQueries.all() });
    },
  });
}

export function useCompleteCareTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await ky.post(`/api/care-tasks/${id}/complete`).json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careTaskQueries.all() });
    },
  });
}
