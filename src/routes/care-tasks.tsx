import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { careTaskQueries, useCompleteCareTaskMutation } from "../plant-queries";

export const Route = createFileRoute("/care-tasks")({
  component: CareTasksComponent,
});

function CareTasksComponent() {
  const { data: careTasks } = useSuspenseQuery(careTaskQueries.list());

  const completeMutation = useCompleteCareTaskMutation();

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Pflegeaufgaben</h1>
      <div className="grid gap-4">
        {careTasks.length === 0 && <p>Keine anstehenden Aufgaben.</p>}
        {careTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between rounded border p-4 shadow-sm"
          >
            <div>
              <div className="font-semibold">
                {task.type} {task.recurring ? "(Wiederkehrend)" : "(Einmalig)"}
              </div>
              <div className="text-sm text-gray-600">
                Fällig am: {new Date(task.nextDueDate).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-600">
                Status: {task.active ? "Aktiv" : "Inaktiv"}
              </div>
              <div className="text-xs text-gray-400">
                Pflanzen-ID: {task.plantId}
              </div>
            </div>
            <button
              onClick={() => completeMutation.mutate(task.id)}
              disabled={completeMutation.isPending || !task.active}
              className="primary"
            >
              {completeMutation.isPending ? "Lädt..." : "Erledigt"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
