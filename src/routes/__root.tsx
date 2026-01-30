import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

const RootLayout = () => (
  <div className={"container mx-auto flex flex-col gap-y-4"}>
    <div className="flex gap-2 p-2">
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>{" "}
      <Link to="/plants/add" className="[&.active]:font-bold">
        Pflanzenverwaltung
      </Link>{" "}
      <Link to="/care-tasks-calendar" className="[&.active]:font-bold">
        Aufgaben
      </Link>{" "}
      <Link to="/invoice" className="[&.active]:font-bold">
        Rechnung
      </Link>{" "}
    </div>
    <div>
      <Outlet />
    </div>
    {/*<TanStackRouterDevtools />*/}
  </div>
);

export const Route = createRootRoute({ component: RootLayout });
