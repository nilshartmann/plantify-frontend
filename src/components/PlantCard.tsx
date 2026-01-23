type PlantCardProps = {
  name: string;
  location: string;
  wateringInterval: number;
  lastWatered?: string;
};

export default function PlantCard({
  name,
  location,
  wateringInterval,
  lastWatered,
}: PlantCardProps) {
  const wateringInfo =
    wateringInterval === 1
      ? "Jeden Tag gießen!"
      : `Alle ${wateringInterval} Tage gießen`;

  return (
    <div className={"PlantCard"}>
      <header>
        <h2>{name}</h2>
        <div>📍{location}</div>
      </header>
      <section>
        <div>{wateringInfo}</div>
        {lastWatered ? <div>Zuletzt: {lastWatered}</div> : null}
      </section>
    </div>
  );
}
