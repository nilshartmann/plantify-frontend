import ky from "ky";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { Plant } from "../types.ts";
import PlantCardListLoader from "./PlantCardListLoader.tsx";
import PlantForm from "./PlantForm.tsx";

const allPlants: Plant[] = [
  {
    id: "1",
    name: "Aloe Vera",
    location: "Schlafzimmer",
    wateringInterval: 12,
    lastWatered: "2025-06-16",
  },
  {
    id: "2",
    name: "Orchidee",
    location: "Wohnzimmer",
    wateringInterval: 20,
  },
];

export default function App() {
  const [interval, setInterval] = useState<number>();
  // const [plants, setPlants] = useState<Plant[]>([]);
  // const [showCounter, setShowCounter] = useState(true);

  // useEffect(() => {
  //   const loadPlantsWithFetch = async () => {
  //     const response = await fetch("http://localhost:7200/api/plants");
  //     const body = await response.json();
  //     const plantsLoaded = Plant.array().parse(body);
  //     setPlants(plantsLoaded);
  //   };
  //
  //   // Im Nerzwerk-Tab prüfen, dass Request nur einmal ausgeführt wird
  //   loadPlantsWithFetch();
  // }, [])
  //
  // const loadPlants = async () => {
  //   const response = await ky.get("http://localhost:7200/api/plants").json();
  //   const plantsLoaded = Plant.array().parse(response);
  //   setPlants(plantsLoaded);
  // };

  // const loadPlantsWithFetch = async () => {
  //   const response = await fetch("http://localhost:7200/api/plants");
  //   const body = await response.json();
  //   const plantsLoaded = Plant.array().parse(body);
  //   setPlants(plantsLoaded);
  // };

  return (
    <div className={"AppContainer"}>
      <ErrorBoundary
        fallback={
          <div className={"error-message"}>
            Fehler beim Laden der Pflanzen 🥀
          </div>
        }
      >
        <Suspense
          fallback={
            <div className={"CardListFallback"}>Pflanzen werden geladen...</div>
          }
        >
          <PlantCardListLoader />
        </Suspense>
      </ErrorBoundary>
      <PlantForm />
    </div>
  );
}
