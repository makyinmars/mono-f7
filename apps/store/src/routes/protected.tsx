import { createFileRoute, redirect } from '@tanstack/react-router';
import { authClient } from '~/clients/auth-client';

export const Route = createFileRoute('/protected')({
  beforeLoad: async () => {
    const auth = await authClient.getSession();
    console.log('auth', auth);
    // const session = await context.queryClient.ensureQueryData(
    //   context.trpc.sessions.current.queryOptions()
    // );
    //
    // if (!session) {
    //   return {
    //     auth: null,
    //   };
    // }
    //
    // console.log('session', session);
    //
    if (!auth.data?.user) {
      return redirect({
        to: '/',
      });
    }

    return {
      auth,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/protected"!</div>;
}
