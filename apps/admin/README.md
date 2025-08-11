# Admin App

This is the admin application built with TanStack Router and TanStack Start.

- [TanStack Router Docs](https://tanstack.com/router)
- [TanStack Start Docs](https://tanstack.com/start)

## Development

From your terminal (run from project root):

```sh
bun install
bun run dev --filter=admin
```

Or run all apps:

```sh
bun run dev
```

This starts the admin app in development mode, rebuilding assets on file changes.

## Building

Build the admin app:

```sh
bun run build --filter=admin
```

## Docker

Build Docker image:

```sh
bun run docker:build:admin
```

Run Docker container:

```sh
bun run docker:run:admin
```

The admin app will be available at http://localhost:3001
