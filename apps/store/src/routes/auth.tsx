import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  component: lazyRouteComponent(() => import("@apps/store/screens/auth")),
});
