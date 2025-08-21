import { useTRPC } from '@repo/api/react';
import { Button } from '@repo/ui/components/button';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import Register from '~/components/auth/register';
export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  const trpc = useTRPC();
  const todosQuery = useQuery(trpc.posts.all.queryOptions());

  return (
    <div className="p-2">
      <h3>Welcome Store!!!</h3>
      <Button variant={'outline'}>Click me</Button>
      <Register />
      <div className="mt-4">
        <h4>Posts:</h4>
        <pre>{JSON.stringify(todosQuery.data, null, 2)}</pre>
      </div>
    </div>
  );
}
