import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/protected')({
  beforeLoad: ({ context }) => {
    console.log('context auth', context.auth);

    if (!context.auth.session) {
      throw redirect({
        to: '/',
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/protected"!</div>;
}
