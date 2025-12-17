import ContentLayout from "@apps/store/components/common/content-layout";
import TodoDelete from "@apps/store/components/todo/todo-delete";
import TodoForm from "@apps/store/components/todo/todo-form";
import { useTRPC } from "@apps/store/trpc/react";
import { TodoStatus } from "@repo/db/schema";
import { Button } from "@repo/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";

const TodoScreen = () => {
  const trpc = useTRPC();
  const todosQuery = useSuspenseQuery(trpc.todo.list.queryOptions());
  const todos = todosQuery.data;

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
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-2xl">My Todos</h2>
        <div className="flex items-center gap-3">
          <TodoForm>
            <Button className="gap-2" variant="default">
              <Plus className="h-4 w-4" />
              Add Todo
            </Button>
          </TodoForm>
        </div>
      </div>

      {todos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="mb-4 text-lg text-muted-foreground">No todos yet</p>
          <TodoForm>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create your first todo
            </Button>
          </TodoForm>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Task</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[100px]">Active</TableHead>
                <TableHead className="w-[150px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todos.map((todo) => (
                <TableRow key={todo.id}>
                  <TableCell className="font-medium">
                    <Link
                      className="hover:text-primary hover:underline"
                      params={{ todoId: todo.id }}
                      to="/todo/$todoId"
                    >
                      {todo.text}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate text-muted-foreground text-sm">
                      {todo.description || "-"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 font-medium text-xs ring-1 ring-gray-500/10 ring-inset ${getStatusColor(
                        todo.status
                      )}`}
                    >
                      {getStatusLabel(todo.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 font-medium text-xs ${
                        todo.active
                          ? "bg-green-50 text-green-700 ring-1 ring-green-600/20 ring-inset"
                          : "bg-gray-50 text-gray-600 ring-1 ring-gray-500/10 ring-inset"
                      }`}
                    >
                      {todo.active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        asChild
                        className="gap-2"
                        size="sm"
                        variant="ghost"
                      >
                        <Link params={{ todoId: todo.id }} to="/todo/$todoId">
                          <Eye className="h-3 w-3" />
                          View
                        </Link>
                      </Button>
                      <TodoForm todo={todo}>
                        <Button className="gap-2" size="sm" variant="outline">
                          <Pencil className="h-3 w-3" />
                          Edit
                        </Button>
                      </TodoForm>
                      <TodoDelete todo={todo}>
                        <Button
                          className="gap-2"
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </TodoDelete>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </ContentLayout>
  );
};

export default TodoScreen;
