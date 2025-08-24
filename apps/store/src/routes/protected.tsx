import { createFileRoute, redirect } from '@tanstack/react-router';
import { currentUserQueryOptions } from '~/fn/auth';

export const Route = createFileRoute('/protected')({
  beforeLoad: async ({ context }) => {
    const authenticatedUser = await context.queryClient.ensureQueryData(
      currentUserQueryOptions
    );
    if (!authenticatedUser.session) {
      return redirect({
        to: '/',
      });
    }

    return {
      auth: {
        session: authenticatedUser.session,
        user: authenticatedUser.user,
      },
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { auth } = Route.useRouteContext();
  console.log('auth', auth);
  return <div>Hello "/protected"!: {JSON.stringify(auth)}</div>;
}
