import LoadingState from "@apps/store/components/common/loading-state";
import { APP_NAME } from "@apps/store/constants/app";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/todo/")({
  loader: async ({ context }) => {
    const todos = await context.queryClient.ensureQueryData(
      context.trpc.todo.list.queryOptions()
    );
    return { todos };
  },
  head: () => ({
    meta: [
      {
        title: `${APP_NAME} - My Todos`,
        description: "View and manage your todo list",
      },
    ],
  }),
  errorComponent: ({ error }) => (
    <div className="flex min-h-96 items-center justify-center">
      <div className="text-center">
        <h2 className="mb-2 font-semibold text-2xl">Error Loading Todos</h2>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="flex min-h-96 items-center justify-center">
      <div className="text-center">
        <h2 className="mb-2 font-semibold text-2xl">Todos Not Found</h2>
        <p className="text-muted-foreground">
          The todos page could not be found.
        </p>
      </div>
    </div>
  ),
  pendingComponent: () => <LoadingState text="Loading todos..." />,
  component: lazyRouteComponent(() => import("@apps/store/screens/todo")),
});
