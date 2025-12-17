import { Route } from "@apps/store/routes/todo/$todoId";
import { useTRPC } from "@apps/store/trpc/react";
import { TodoStatus } from "@repo/db/schema";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Separator } from "@repo/ui/components/separator";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import ContentLayout from "../common/content-layout";
import TodoDelete from "./todo-delete";
import TodoForm from "./todo-form";

function TodoDetail() {
  const trpc = useTRPC();
  const { todoId } = Route.useParams();
  const todoQuery = useSuspenseQuery(
    trpc.todo.byId.queryOptions({ id: todoId }, { enabled: !!todoId })
  );

  const formatDate = (date: Date | string | null) => {
    if (!date) {
      return "-";
    }
    const d = new Date(date);
    return d.toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: TodoStatus) => {
    switch (status) {
      case TodoStatus.NOT_STARTED:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      case TodoStatus.IN_PROGRESS:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case TodoStatus.COMPLETED:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getStatusLabel = (status: TodoStatus) => {
    switch (status) {
      case TodoStatus.NOT_STARTED:
        return "Not Started";
      case TodoStatus.IN_PROGRESS:
        return "In Progress";
      case TodoStatus.COMPLETED:
        return "Completed";
      default:
        return "Unknown";
    }
  };

  return (
    <ContentLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-3xl">Todo Details</h1>
          <div className="flex items-center gap-2">
            <TodoForm todo={todoQuery.data}>
              <Button className="gap-2" variant="outline">
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            </TodoForm>
            <TodoDelete todo={todoQuery.data}>
              <Button className="gap-2" variant="destructive">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </TodoDelete>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{todoQuery.data.text}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {todoQuery.data.description && (
              <>
                <div className="space-y-2">
                  <h3 className="font-medium text-muted-foreground text-sm">
                    Description
                  </h3>
                  <p className="text-sm">{todoQuery.data.description}</p>
                </div>
                <Separator />
              </>
            )}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-medium text-muted-foreground text-sm">
                  Status
                </h3>
                <span
                  className={`inline-flex items-center rounded-md px-3 py-1 font-medium text-sm ring-1 ring-gray-500/10 ring-inset ${getStatusColor(
                    todoQuery.data.status
                  )}`}
                >
                  {getStatusLabel(todoQuery.data.status)}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-muted-foreground text-sm">
                  Active State
                </h3>
                <span
                  className={`inline-flex items-center rounded-md px-3 py-1 font-medium text-sm ${
                    todoQuery.data.active
                      ? "bg-green-50 text-green-700 ring-1 ring-green-600/20 ring-inset"
                      : "bg-gray-50 text-gray-600 ring-1 ring-gray-500/10 ring-inset"
                  }`}
                >
                  {todoQuery.data.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-medium text-muted-foreground text-sm">
                  Created At
                </h3>
                <p className="text-sm">
                  {formatDate(todoQuery.data.createdAt)}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-muted-foreground text-sm">
                  Last Updated
                </h3>
                <p className="text-sm">
                  {formatDate(todoQuery.data.updatedAt)}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium text-muted-foreground text-sm">
                Todo ID
              </h3>
              <p className="font-mono text-muted-foreground text-sm">
                {todoId}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}

export default TodoDetail;
