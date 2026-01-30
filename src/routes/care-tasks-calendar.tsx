import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, useMemo } from "react";

import {
  careTaskQueries,
  ownerQueries,
  plantQueries,
  useCompleteCareTaskMutation,
} from "../plant-queries";
import { CareTaskDto } from "../types";

export const Route = createFileRoute("/care-tasks-calendar")({
  component: CareTaskCalendarComponent,
});

const CARE_TASK_TYPE_LABELS: Record<string, string> = {
  WATERING: "Gießen",
  FERTILIZING: "Düngen",
  PRUNING: "Schneiden",
  REPOTTING: "Umtopfen",
  PEST_CONTROL: "Schädlingsbekämpfung",
};

interface ProjectedCareTask extends CareTaskDto {
  isProjected: boolean;
  projectedDate: string;
}

function CareTaskItem({ task }: { task: ProjectedCareTask }) {
  const completeMutation = useCompleteCareTaskMutation();

  const { data: plant, isLoading: isLoadingPlant } = useQuery(
    plantQueries.detail(task.plantId),
  );

  const { data: owner, isLoading: isLoadingOwner } = useQuery({
    ...ownerQueries.detail(plant?.ownerId ?? ""),
    enabled: !!plant?.ownerId,
  });

  const formattedDate = new Date(task.projectedDate).toLocaleDateString(
    "de-DE",
  );

  const recurrenceLabel =
    task.recurring && task.interval
      ? `(alle ${task.interval} Tage)`
      : "(einmalig)";

  return (
    <div
      className={`flex items-start justify-between rounded border p-4 shadow-sm ${
        task.isProjected
          ? "border-dashed border-gray-300 bg-gray-50 opacity-80"
          : "bg-white"
      }`}
    >
      <div>
        <div className="text-lg font-bold text-green-800">
          {isLoadingPlant ? "Lädt..." : (plant?.name ?? "Unbekannte Pflanze")}
          {task.isProjected && (
            <span className="ml-2 text-xs font-normal text-gray-400 italic">
              (Projiziert)
            </span>
          )}
        </div>
        <div className="text-sm font-medium text-gray-700">
          Besitzer: {isLoadingOwner ? "Lädt..." : (owner?.name ?? "Unbekannt")}
        </div>
        <div className="mt-1 font-semibold text-gray-900">
          {CARE_TASK_TYPE_LABELS[task.type] ?? task.type}
        </div>
        <div className="text-sm text-gray-600">
          Fällig: {formattedDate} {recurrenceLabel}
        </div>
      </div>
      {!task.isProjected && (
        <div className="flex flex-col items-end gap-2">
          {!task.active && !task.recurring && (
            <span className="rounded bg-green-600 px-3.5 py-1.5 text-xs font-medium text-white">
              ✅ Erledigt
            </span>
          )}
          {task.active && (
            <button
              onClick={() => completeMutation.mutate(task.id)}
              disabled={completeMutation.isPending || !task.active}
              className="primary"
            >
              {completeMutation.isPending
                ? "Lädt..."
                : "Ausführung protokollieren"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function CareTaskCalendarComponent() {
  const { data: careTasks } = useSuspenseQuery(careTaskQueries.list());

  const projectedTasks = useMemo(() => {
    const now = new Date();
    const twoMonthsLater = new Date();
    twoMonthsLater.setMonth(now.getMonth() + 2);

    const allTasks: ProjectedCareTask[] = [];

    careTasks.forEach((task) => {
      const dueDate = new Date(task.nextDueDate);

      // Original Task hinzufügen
      allTasks.push({
        ...task,
        isProjected: false,
        projectedDate: task.nextDueDate,
      });

      // Wenn wiederkehrend, zukünftige Termine berechnen
      if (task.recurring && task.interval) {
        let nextDate = new Date(dueDate);
        const intervalDays = task.interval;

        while (true) {
          nextDate.setDate(nextDate.getDate() + intervalDays);
          if (nextDate > twoMonthsLater) break;

          allTasks.push({
            ...task,
            isProjected: true,
            projectedDate: nextDate.toISOString(),
          });
        }
      }
    });

    // Nach Datum sortieren
    return allTasks.sort(
      (a, b) =>
        new Date(a.projectedDate).getTime() -
        new Date(b.projectedDate).getTime(),
    );
  }, [careTasks]);

  // Gruppierung nach Datum für die Anzeige
  const groupedTasks = useMemo(() => {
    const groups: Record<string, ProjectedCareTask[]> = {};
    projectedTasks.forEach((task) => {
      const dateKey = new Date(task.projectedDate).toISOString().split("T")[0];
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(task);
    });
    return groups;
  }, [projectedTasks]);

  const dateKeys = Object.keys(groupedTasks).sort();

  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl font-bold">
        Pflegekalender (Nächste 2 Monate)
      </h1>
      <div className="space-y-8">
        {dateKeys.length === 0 && (
          <p>Keine anstehenden Aufgaben im Zeitraum.</p>
        )}
        {dateKeys.map((dateKey) => (
          <div key={dateKey}>
            <h2 className="mb-3 border-b pb-1 text-lg font-semibold text-gray-800">
              {new Date(dateKey).toLocaleDateString("de-DE", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </h2>
            <div className="grid gap-4">
              {groupedTasks[dateKey].map((task, idx) => (
                <Suspense
                  key={`${task.id}-${task.projectedDate}-${idx}`}
                  fallback={
                    <div className="h-24 animate-pulse rounded border bg-gray-50" />
                  }
                >
                  <CareTaskItem task={task} />
                </Suspense>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
