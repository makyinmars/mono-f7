import { useTRPC } from "@repo/api/react";
import { Card, CardContent } from "@repo/ui/components/card";
import { Skeleton } from "@repo/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import { TodoCard } from "./todo-card";

export function TodoList() {
  const trpc = useTRPC();
  const todosQuery = useQuery(trpc.todos.all.queryOptions());

  if (todosQuery.isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card className="h-48" key={index}>
            <CardContent className="p-4">
              <Skeleton className="mb-2 h-4 w-3/4" />
              <Skeleton className="mb-4 h-4 w-1/2" />
              <Skeleton className="mb-2 h-3 w-full" />
              <Skeleton className="mb-2 h-3 w-full" />
              <Skeleton className="mb-4 h-3 w-2/3" />
              <div className="flex gap-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (todosQuery.isError) {
    return (
      <Card className="text-center">
        <CardContent>
          <div className="mb-2 text-destructive">Failed to load todos</div>
          <p className="text-muted-foreground text-sm">
            {todosQuery.error?.message ||
              "An error occurred while fetching todos."}
          </p>
        </CardContent>
      </Card>
    );
  }

  const todos = todosQuery.data || [];

  if (todos.length === 0) {
    return (
      <Card className="text-center">
        <CardContent>
          <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 font-semibold text-lg">No todos yet</h3>
          <p className="text-muted-foreground">
            Your todos will appear here once you create some.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {todos.map((todo) => (
        <TodoCard key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
