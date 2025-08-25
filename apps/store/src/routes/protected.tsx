import { Separator } from '@repo/ui/components/separator';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { TodoList } from '~/components/todo/todo-list';
import { UserMenu } from '~/components/user-menu';
import { Link } from '@tanstack/react-router';
import { Route as MainRoute } from '../routes/__root';
import { currentUserQueryOptions } from '~/fn/auth';

export const Route = createFileRoute('/protected')({
  beforeLoad: async ({ context }) => {
    const authenticatedUser = await context.queryClient.ensureQueryData(
      currentUserQueryOptions
    );

    console.log('authenticatedUser', authenticatedUser);

    if (!authenticatedUser.user) {
      return redirect({
        to: '/',
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { auth } = MainRoute.useRouteContext();
  console.log('auth', auth);
  return (
    <div className="min-h-screen bg-background space-y-4">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Link to="/">
                  <div className="rounded-lg bg-black p-2 text-white">
                    <div className="h-6 w-6 rounded-sm bg-white" />
                  </div>
                </Link>
                <div>
                  <h1 className="font-semibold text-xl">Dashboard</h1>
                  <p className="text-muted-foreground text-sm">
                    Welcome back, {auth.user?.name}
                  </p>
                </div>
              </div>
            </div>

            <UserMenu session={auth.session} user={auth.user} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col gap-4">
        <div className="space-y-6">
          {/* Page Title */}
          <div className="space-y-2">
            <h2 className="font-bold text-3xl tracking-tight">Your Todos</h2>
            <p className="text-muted-foreground">
              Manage your tasks and stay organized
            </p>
          </div>

          <Separator />

          {/* Todos Grid */}
          <TodoList />
        </div>
      </main>
    </div>
  );
}
