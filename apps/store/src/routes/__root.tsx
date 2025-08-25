/// <reference types="vite/client" />

import { DefaultCatchBoundary } from "@apps/store/components/default-catch-boundary";
import NotFound from "@apps/store/components/not-found";
import { currentUserQueryOptions } from "@apps/store/fn/auth";
import { seo } from "@apps/store/utils/seo";
import type { AppRouter } from "@repo/api/server";
import { Toaster } from "@repo/ui/components/sonner";
import appCss from "@repo/ui/globals.css?url";
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type * as React from "react";

export type MyRouterContext = {
  queryClient: QueryClient;
  trpc: TRPCOptionsProxy<AppRouter>;
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title:
          "TanStack Start | Type-Safe, Client-First, Full-Stack React Framework",
        description:
          "TanStack Start is a type-safe, client-first, full-stack React framework. ",
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  beforeLoad: async ({ context }) => {
    const authenticatedUser = await context.queryClient.ensureQueryData(
      currentUserQueryOptions
    );

    return {
      auth: {
        session: authenticatedUser?.session,
        user: authenticatedUser?.user,
      },
    };
  },
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body className="flex flex-col gap-4 p-4">
        {children}
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
        <Toaster />
      </body>
    </html>
  );
}
