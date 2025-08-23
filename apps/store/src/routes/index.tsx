import { useTRPC } from '@repo/api/react';
import { Button } from '@repo/ui/components/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui/components/tabs';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import Login from '~/components/auth/login';
import Register from '~/components/auth/register';
export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  const trpc = useTRPC();
  const todosQuery = useQuery(trpc.posts.all.queryOptions());

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="mb-8">
        <div className="mb-8 flex items-center justify-center">
          <div className="mr-3 rounded-lg bg-black p-2 text-white">
            <div className="h-6 w-6 rounded-sm bg-white" />
          </div>
          <h1 className="font-semibold text-xl">Acme Inc.</h1>
        </div>

        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle>Welcome back</CardTitle>
            <p className="text-muted-foreground text-sm">
              Login with your Apple or Google account
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
      </div>

      <div className="mt-8 text-center text-muted-foreground text-sm">
        By clicking continue, you agree to our Terms of Service and Privacy
        Policy .
      </div>

      <div className="mt-8">
        <h3>Welcome Store!!!</h3>
        <Button variant={'outline'}>Click me</Button>
        <div className="mt-4">
          <h4>Posts:</h4>
          <pre>{JSON.stringify(todosQuery.data, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
