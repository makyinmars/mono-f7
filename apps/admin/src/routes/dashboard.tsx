import { UserMenu } from "@apps/admin/components/auth/user-menu";
import { authMiddleware } from "@apps/admin/middleware/auth";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  server: {
    middleware: [authMiddleware],
  },
});

function Dashboard() {
  const { auth } = Route.useRouteContext();

  console.log("auth", auth);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-black p-2 text-white">
                  <div className="h-6 w-6 rounded-sm bg-white" />
                </div>
                <div>
                  <h1 className="font-semibold text-xl">Admin Dashboard</h1>
                  <p className="text-muted-foreground text-sm">
                    Welcome back, {auth?.user?.name}
                  </p>
                </div>
              </div>
            </div>

            <UserMenu auth={auth} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="font-bold text-3xl tracking-tight">
              Welcome to the Admin Dashboard
            </h2>
            <p className="text-muted-foreground">
              You are now logged in. Start managing your application.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <h3 className="font-semibold text-lg">Users</h3>
              <p className="text-muted-foreground text-sm">
                Manage user accounts
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <h3 className="font-semibold text-lg">Settings</h3>
              <p className="text-muted-foreground text-sm">
                Configure application settings
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <h3 className="font-semibold text-lg">Analytics</h3>
              <p className="text-muted-foreground text-sm">
                View usage statistics
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
