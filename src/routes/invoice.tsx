import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { useTimeMachineMutation } from "../plant-queries";

export const Route = createFileRoute("/invoice")({
  component: InvoiceComponent,
});

function InvoiceComponent() {
  const [shiftBy, setShiftBy] = useState<number>(0);
  const [resultDate, setResultDate] = useState<string | null>(null);
  const mutation = useTimeMachineMutation();

  const handleTimeTravel = () => {
    mutation.mutate(shiftBy, {
      onSuccess: (data) => {
        setResultDate(data);
      },
    });
  };

  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl font-bold">Rechnung</h1>
      <div className="max-w-md space-y-4">
        <div>
          <p className="mb-2 text-sm text-gray-600">
            Aktuelles Datum:{" "}
            <span className="font-semibold text-gray-800">
              {new Date().toLocaleDateString("de-DE")}
            </span>
          </p>
          <label className="block text-sm font-medium text-gray-700">
            Zeit vorspulen (Tage)
          </label>
          <input
            type="number"
            value={shiftBy}
            onChange={(e) => setShiftBy(parseInt(e.target.value) || 0)}
            className="mt-1 block w-full rounded border border-gray-300 p-2 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <button
          onClick={handleTimeTravel}
          disabled={mutation.isPending}
          className="primary w-full"
        >
          {mutation.isPending ? "Spule vor..." : "Zeit vorspulen"}
        </button>

        {mutation.isError && (
          <div className="rounded border border-red-200 bg-red-50 p-4 text-red-700">
            Fehler: {mutation.error.message}
          </div>
        )}

        {resultDate && (
          <div className="rounded border border-green-200 bg-green-50 p-4">
            <p className="text-sm font-medium text-green-800">Neues Datum:</p>
            <p className="text-lg font-semibold text-green-900">
              {new Date(resultDate).toLocaleDateString("de-DE")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
