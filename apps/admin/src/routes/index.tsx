import Login from "@apps/admin/components/auth/login";
import Register from "@apps/admin/components/auth/register";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center">
          <div className="mr-3 rounded-lg bg-black p-2 text-white">
            <div className="h-6 w-6 rounded-sm bg-white" />
          </div>
          <h1 className="font-semibold text-xl">Admin Portal</h1>
        </div>

        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle>Welcome back</CardTitle>
            <p className="text-muted-foreground text-sm">
              Sign in to access the admin dashboard
            </p>
          </CardHeader>
          <CardContent>
            <Tabs className="w-full" defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign up</TabsTrigger>
              </TabsList>
              <TabsContent className="mt-6" value="login">
                <Login />
              </TabsContent>
              <TabsContent className="mt-6" value="signup">
                <Register />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-muted-foreground text-sm">
          By clicking continue, you agree to our Terms of Service and Privacy
          Policy.
        </div>
      </div>
    </div>
  );
}
