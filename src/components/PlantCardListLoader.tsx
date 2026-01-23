import { useSuspenseQuery } from "@tanstack/react-query";
import ky from "ky";

import { Plant } from "../types.ts";
import PlantCardList from "./PlantCardList.tsx";

export default function PlantCardListLoader() {
  const { data: plants } = useSuspenseQuery({
    queryKey: ["plants", "list"],
    async queryFn() {
      const response = await ky
        .get("http://localhost:7200/api/plants", { retry: 0 })
        .json();
      return Plant.array().parse(response);
    },
    retry: false,
  });

  return <PlantCardList plants={plants} />;
}
