import LoadingState from "@apps/store/components/common/loading-state";
import { APP_NAME } from "@apps/store/constants/app";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { z } from "zod/v4";

export const Route = createFileRoute("/todo/$todoId")({
  parseParams: (params) => ({
    todoId: z.uuid("Invalid todo ID format").parse(params.todoId),
  }),
  loader: async ({ context, params }) => {
    const { todoId } = params;

    try {
      const todo = await context.queryClient.ensureQueryData(
        context.trpc.todo.byId.queryOptions(
          {
            id: todoId,
          },
          {
            enabled: !!todoId,
          }
        )
      );
      return { todo };
    } catch (_error) {
      throw new Error(`Todo not found or invalid: ${todoId}`);
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${APP_NAME} - Todo ${loaderData?.todo.text || "Todo item"}`,
        description: loaderData?.todo.description
          ? `${loaderData.todo.description}`
          : `Managing todo: ${loaderData?.todo.text || "Todo item"}`,
      },
    ],
  }),
  errorComponent: ({ error }) => {
    const isInvalidFormat = error.message.includes("Invalid todo ID format");
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 font-semibold text-2xl">
            {isInvalidFormat ? "Invalid Todo ID" : "Todo Not Found"}
          </h2>
          <p className="text-muted-foreground">
            {isInvalidFormat
              ? "The todo ID provided is not in the correct format."
              : error.message}
          </p>
        </div>
      </div>
    );
  },
  notFoundComponent: () => (
    <div className="flex min-h-96 items-center justify-center">
      <div className="text-center">
        <h2 className="mb-2 font-semibold text-2xl">Todo Not Found</h2>
        <p className="text-muted-foreground">
          The todo you're looking for doesn't exist.
        </p>
      </div>
    </div>
  ),
  pendingComponent: () => <LoadingState text="Loading todo details..." />,
  component: lazyRouteComponent(
    () => import("@apps/store/components/todo/todo-detail")
  ),
});
