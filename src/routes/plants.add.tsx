import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

import { useAddPlantMutation } from "../plant-queries";
import { NewPlantRequest, PlantType } from "../types";

export const Route = createFileRoute("/plants/add")({
  component: AddPlantComponent,
});

function AddPlantComponent() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<NewPlantRequest>({
    resolver: zodResolver(NewPlantRequest),
    defaultValues: {
      plantType: "INDOOR",
    },
  });

  const mutation = useAddPlantMutation();

  const onSubmit = (data: NewPlantRequest) => {
    mutation.mutate(data, {
      onSuccess: () => {
        navigate({ to: "/" });
      },
    });
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Neue Pflanze anlegen</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Owner ID (UUID)
          </label>
          <input
            {...register("ownerId")}
            className="mt-1 block w-full rounded border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="z.B. 550e8400-e29b-41d4-a716-446655440000"
          />
          <button
            type="button"
            onClick={() => setValue("ownerId", crypto.randomUUID())}
            className="mt-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
          >
            UUID generieren
          </button>
          {errors.ownerId && (
            <p className="mt-1 text-sm text-red-600">
              {errors.ownerId.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            {...register("name")}
            className="mt-1 block w-full rounded border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="z.B. Monstera"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pflanzentyp
          </label>
          <select
            {...register("plantType")}
            className="mt-1 block w-full rounded border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {PlantType.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.plantType && (
            <p className="mt-1 text-sm text-red-600">
              {errors.plantType.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Standort
          </label>
          <input
            {...register("location")}
            className="mt-1 block w-full rounded border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="z.B. Wohnzimmer"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">
              {errors.location.message}
            </p>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {mutation.isPending ? "Speichert..." : "Pflanze anlegen"}
          </button>
        </div>
        {mutation.isError && (
          <p className="mt-2 text-sm text-red-600">
            Fehler beim Speichern: {mutation.error.message}
          </p>
        )}
      </form>
    </div>
  );
}
