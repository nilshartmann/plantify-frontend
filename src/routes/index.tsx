import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className={"container mx-auto p-8"}>
      <h1 className={"text-5xl text-green-700"}>Plantify 🌱</h1>
    </div>
  );
}
