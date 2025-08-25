import { TodoStatus } from '@repo/db/schema';
import { Badge } from '@repo/ui/components/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { Calendar, CheckCircle, Clock, Play } from 'lucide-react';
import { TodoAllProcedure } from '@repo/api/server';

const statusConfig = {
  [TodoStatus.NOT_STARTED]: {
    label: 'Not Started',
    variant: 'outline' as const,
    icon: Clock,
    className: 'text-gray-600 border-gray-300',
  },
  [TodoStatus.IN_PROGRESS]: {
    label: 'In Progress',
    variant: 'default' as const,
    icon: Play,
    className: 'text-blue-600 bg-blue-50 border-blue-200',
  },
  [TodoStatus.COMPLETED]: {
    label: 'Completed',
    variant: 'secondary' as const,
    icon: CheckCircle,
    className: 'text-green-600 bg-green-50 border-green-200',
  },
};

export function TodoCard({ todo }: { todo: TodoAllProcedure[number] }) {
  const statusInfo = statusConfig[todo.status];
  const StatusIcon = statusInfo.icon;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="line-clamp-2 font-semibold text-lg">
            {todo.text}
          </CardTitle>
          <Badge
            className={`ml-2 ${statusInfo.className}`}
            variant={statusInfo.variant}
          >
            <StatusIcon className="mr-1 h-3 w-3" />
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {todo.description && (
          <p className="mb-3 line-clamp-3 text-muted-foreground text-sm">
            {todo.description}
          </p>
        )}

        <div className="flex flex-col gap-1 text-muted-foreground text-xs">
          <div className="flex items-center">
            <Calendar className="mr-1 h-3 w-3" />
            <span>Created: {formatDate(todo.createdAt)}</span>
          </div>

          {todo.updatedAt &&
            todo.updatedAt.getTime() !== todo.createdAt.getTime() && (
              <div className="flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                <span>Updated: {formatDate(todo.updatedAt)}</span>
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
