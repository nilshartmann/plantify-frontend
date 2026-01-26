import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import _ky from "ky";

import { CareTaskDto, NewPlantRequest, OwnerDto, PlantDto } from "./types";

const ky = _ky.extend({
  retry: 0,
});

export const ownerQueries = {
  all: () => ["owners"] as const,
  list: () =>
    queryOptions({
      queryKey: ownerQueries.all(),
      queryFn: async () => {
        const response = await ky.get("/api/owners").json();
        return OwnerDto.array().parse(response);
      },
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: [...ownerQueries.all(), id] as const,
      queryFn: async () => {
        const response = await ky.get(`/api/owners/${id}`).json();
        return OwnerDto.parse(response);
      },
    }),
};

export const plantQueries = {
  all: () => ["plants"] as const,
  lists: () => [...plantQueries.all(), "list"] as const,
  list: () =>
    queryOptions({
      queryKey: plantQueries.lists(),
      queryFn: async () => {
        const response = await ky.get("/api/plants").json();
        return PlantDto.array().parse(response);
      },
      retry: false,
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: [...plantQueries.all(), id] as const,
      queryFn: async () => {
        const response = await ky.get(`/api/plants/${id}`).json();
        return PlantDto.parse(response);
      },
    }),
};

export const careTaskQueries = {
  all: () => ["care-tasks"] as const,
  list: () =>
    queryOptions({
      queryKey: careTaskQueries.all(),
      queryFn: async () => {
        const response = await ky.get("/api/care-tasks").json();
        return CareTaskDto.array().parse(response);
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

export function useTimeMachineMutation() {
  return useMutation({
    mutationFn: async (shiftBy: number) => {
      const response = await ky.post(`/api/timemachine/${shiftBy}`).text();
      return response;
    },
  });
}
