import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import ky from "ky";

export const Route = createFileRoute("/about")({
  component: RouteComponent,
});

function RouteComponent() {
  const x = useSuspenseQuery({
    queryKey: ["care-tasks"],
    async queryFn() {
      const response = await ky.get("/api/care-tasks").json();
      console.log(response);
      return response;
    },
  });
  return <div>Hello "/about"!</div>;
}
