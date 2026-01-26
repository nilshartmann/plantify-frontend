import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

const RootLayout = () => (
  <>
    <div className="flex gap-2 p-2">
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>{" "}
      <Link to="/care-tasks" className="[&.active]:font-bold">
        Care Tasks
      </Link>{" "}
      <Link to="/plants/add" className="[&.active]:font-bold">
        Add Plant
      </Link>{" "}
      <Link to="/about" className="[&.active]:font-bold">
        About
      </Link>
    </div>
    <hr />
    <Outlet />
    {/*<TanStackRouterDevtools />*/}
  </>
);

export const Route = createRootRoute({ component: RootLayout });
