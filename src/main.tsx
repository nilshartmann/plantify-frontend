import "./index.css";
import "./setup-dayjs.ts";

import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { createRoot } from "react-dom/client";

import { createQueryClient } from "./create-query-client.tsx";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

const queryClient = createQueryClient();

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    {/*<ReactQueryDevtools />*/}
  </QueryClientProvider>,
);
