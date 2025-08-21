import { Button } from '@repo/ui/components/button';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <div className="p-2">
      <h3>Welcome Admin!!!</h3>
      <Button variant={'outline'}>Click me</Button>
    </div>
  );
}
