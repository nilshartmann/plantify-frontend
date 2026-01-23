import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ky from "ky";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod/v4";

import { Plant } from "../types.ts";
import IntervalSelector from "./IntervalSelector.tsx";

const locations = [
  "Wohnzimmer",
  "Arbeitszimmer",
  "Küche",
  "Schlafzimmer",
  "Bad",
];

// im richtigen Leben könnte man hier evtl. auch den
// Plant State verwenden, ich habe die Definition hierher kopiert,
// weil wir keine id brauchen und im ersten Schritt auch kein wateringInterval
const PlantFormState = z.object({
  name: z.string().nonempty("Bitte gib den Namen deiner Pflanze ein"),
  location: z.string().nonempty("Bitte wähle den Standort deiner Pflanze aus"),
  wateringInterval: z
    .number("Bitte gib an, wie häufig die Pflanze gegossen werden muss")
    .min(1, "Bitte gib die Anzahl in Tagen ein, mindestens jeden Tag"),
  // lastWatered: z
  //   .string()
  //   .transform((s) => (s === "" ? undefined : s))
  //   .pipe(z.iso.date().optional()),
  lastWatered: z.iso.date("Bitte gib ein gültiges Datum ein").optional(),
});
type PlantFormState = z.infer<typeof PlantFormState>;

export default function PlantForm() {
  const form = useForm({
    resolver: zodResolver(PlantFormState),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    async mutationFn(data: PlantFormState) {
      const response = await ky
        .post("http://localhost:7200/api/plants", {
          json: data,
        })
        .json();
      const newPlant = Plant.parse(response);
      return newPlant;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["plants", "list"] });
    },
  });

  const handleSave = async (data: PlantFormState) => {
    console.log("DATA", data);

    mutation.mutate(data);
  };

  const handleError = (errs: any) => {
    console.log("Form Errors", errs);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSave, handleError)}>
      <div className={"FormControl"}>
        <label>Name der Pflanze</label>
        <input
          {...form.register("name")}
          className={form.formState.errors.name?.message ? "error" : undefined}
        />
        <ErrorMessage msg={form.formState.errors.name?.message} />
      </div>

      <div className={"FormControl"}>
        <label>Standort</label>
        <select
          {...form.register("location")}
          className={
            form.formState.errors.location?.message ? "error" : undefined
          }
        >
          <option value="">Standort wählen...</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
        <ErrorMessage msg={form.formState.errors.location?.message} />
      </div>

      <div className={"FormControl"}>
        <Controller
          control={form.control}
          name={"wateringInterval"}
          render={(field) => {
            return (
              <IntervalSelector
                interval={field.field.value}
                onIntervalChange={field.field.onChange}
                error={field.fieldState.error?.message !== undefined}
              />
            );
          }}
        />
        <ErrorMessage msg={form.formState.errors.wateringInterval?.message} />
      </div>

      <div className={"FormControl"}>
        <label>Zuletzt gegossen</label>
        <input
          {...form.register("lastWatered", {
            setValueAs: (value) => (value === "" ? undefined : value),
          })}
          type={"date"}
          className={
            form.formState.errors.lastWatered?.message ? "error" : undefined
          }
        />
        <ErrorMessage msg={form.formState.errors.lastWatered?.message} />
      </div>

      <div className={"FormButtons"}>
        <button
          type="button"
          onClick={() => form.reset()}
          className={"secondary"}
        >
          Eingaben löschen 🧹
        </button>

        <button type={"submit"} className={"primary"}>
          Pflanze hinzufügen 🌱
        </button>
      </div>
      {mutation.isError && (
        <div className={"error-message"}>Speichern fehlgeschlagen</div>
      )}
      {mutation.isSuccess && (
        <div className={"success-message"}>Pflanze angelegt</div>
      )}
    </form>
  );
}

type ErrorMessageProps = {
  msg?: string;
};
function ErrorMessage({ msg }: ErrorMessageProps) {
  if (!msg) {
    return null;
  }
  return <span className={"error-message"}>{msg}</span>;
}
