import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import { useTimeMachineMutation } from "../plant-queries";

export const Route = createFileRoute("/invoice")({
  component: InvoiceComponent,
});

function InvoiceComponent() {
  const [shiftBy, setShiftBy] = useState<number>(0);
  const [resultDate, setResultDate] = useState<string | null>(
    new Date().toLocaleDateString("de-DE"),
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const mutation = useTimeMachineMutation();

  const [animationInterval, setAnimationInterval] = useState<number | null>(
    null,
  );

  useEffect(() => {
    return () => {
      if (animationInterval) {
        clearInterval(animationInterval);
      }
    };
  }, [animationInterval]);

  const animateDate = (targetDateStr: string) => {
    setIsAnimating(true);

    let daysRemaining = shiftBy;
    const current = resultDate ? parseGermanDate(resultDate) : new Date();

    const interval = window.setInterval(() => {
      if (daysRemaining <= 0) {
        setResultDate(targetDateStr);
        clearInterval(interval);
        setAnimationInterval(null);
        setIsAnimating(false);
      } else {
        current.setDate(current.getDate() + 1);
        setResultDate(current.toLocaleDateString("de-DE"));
        daysRemaining--;
      }
    }, 180);
    setAnimationInterval(interval);
  };

  const parseGermanDate = (dateStr: string) => {
    const parts = dateStr.split(".");
    if (parts.length === 3) {
      return new Date(
        parseInt(parts[2]),
        parseInt(parts[1]) - 1,
        parseInt(parts[0]),
      );
    }
    return new Date(dateStr);
  };

  const handleTimeTravel = () => {
    mutation.mutate(shiftBy, {
      onSuccess: (data) => {
        animateDate(new Date(data).toLocaleDateString("de-DE"));
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
            <span className="font-semibold text-gray-800">{resultDate}</span>
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
          disabled={mutation.isPending || isAnimating}
          className={twMerge(
            "rounded-lg bg-green-600 px-4 py-2 font-semibold text-white shadow-md transition-colors duration-200 hover:bg-green-700 hover:shadow-lg disabled:cursor-default disabled:hover:bg-green-600 disabled:hover:shadow-none",
            isAnimating && "animate-pulse",
          )}
        >
          {mutation.isPending || isAnimating
            ? "Spule vor..."
            : "Zeit vorspulen"}
        </button>
        {mutation.isSuccess && !isAnimating && <div>✅ Vorgespult!</div>}

        {mutation.isError && (
          <div className="rounded border border-red-200 bg-red-50 p-4 text-red-700">
            Fehler: {mutation.error.message}
          </div>
        )}
      </div>
    </div>
  );
}
