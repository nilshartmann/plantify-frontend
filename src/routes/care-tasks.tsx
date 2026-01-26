import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

import {
  careTaskQueries,
  ownerQueries,
  plantQueries,
  useCompleteCareTaskMutation,
} from "../plant-queries";
import { CareTaskDto as CareTaskType } from "../types";

export const Route = createFileRoute("/care-tasks")({
  component: CareTasksComponent,
});

const CARE_TASK_TYPE_LABELS: Record<string, string> = {
  WATERING: "Gießen",
  FERTILIZING: "Düngen",
  PRUNING: "Schneiden",
  REPOTTING: "Umtopfen",
  PEST_CONTROL: "Schädlingsbekämpfung",
};

function CareTaskItem({ task }: { task: CareTaskType }) {
  const completeMutation = useCompleteCareTaskMutation();

  const {
    data: plant,
    isLoading: isLoadingPlant,
    error: plantError,
  } = useQuery(plantQueries.detail(task.plantId));

  const {
    data: owner,
    isLoading: isLoadingOwner,
    error: ownerError,
  } = useQuery({
    ...ownerQueries.detail(plant?.ownerId ?? ""),
    enabled: !!plant?.ownerId,
  });

  if (plantError) {
    console.log("Could not load plant", plantError);
  } else {
    console.log("plant", plant);
  }

  if (ownerError) {
    console.log("Could not load owner", ownerError);
  } else {
    console.log("owner", owner);
  }

  return (
    <div className="flex items-center justify-between rounded border p-4 shadow-sm">
      <div>
        <div className="text-lg font-bold text-green-800">
          {isLoadingPlant ? "Lädt..." : (plant?.name ?? "Unbekannte Pflanze")}
        </div>
        <div className="text-sm font-medium text-gray-700">
          Besitzer: {isLoadingOwner ? "Lädt..." : (owner?.name ?? "Unbekannt")}
        </div>
        <div className="mt-2 font-semibold text-gray-900">
          {CARE_TASK_TYPE_LABELS[task.type] ?? task.type}
        </div>
        <div className="text-sm text-gray-600">
          Standort:{" "}
          {isLoadingPlant ? "Lädt..." : (plant?.location ?? "Unbekannt")}
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Fällig am: {new Date(task.nextDueDate).toLocaleDateString()}{" "}
          <span className="text-gray-500 italic">
            {task.recurring ? "(wiederkehrend)" : "(einmalig)"}
          </span>
        </div>
        <div className="text-sm text-gray-600">
          Status: {task.active ? "Aktiv" : "Inaktiv"}
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        {!task.active && !task.recurring && (
          <span className="rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            Erledigt
          </span>
        )}
        <button
          onClick={() => completeMutation.mutate(task.id)}
          disabled={completeMutation.isPending || !task.active}
          className="primary"
        >
          {completeMutation.isPending ? "Lädt..." : "Ausführung protokollieren"}
        </button>
      </div>
    </div>
  );
}

function CareTasksComponent() {
  const { data: careTasks } = useSuspenseQuery(careTaskQueries.list());

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Pflegeaufgaben</h1>
      <div className="grid gap-4">
        {careTasks.length === 0 && <p>Keine anstehenden Aufgaben.</p>}
        {careTasks.map((task) => (
          <Suspense
            key={task.id}
            fallback={
              <div className="h-32 animate-pulse rounded border bg-gray-50" />
            }
          >
            <CareTaskItem task={task} />
          </Suspense>
        ))}
      </div>
    </div>
  );
}
