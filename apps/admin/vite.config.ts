// import { tanstackStart } from "@tanstack/react-start/plugin/vite";
// import viteReact from "@vitejs/plugin-react";
// import { defineConfig } from "vite";
// import tsConfigPaths from "vite-tsconfig-paths";
//
// export default defineConfig({
//   server: {
//     port: 3001,
//   },
//   plugins: [
//     tsConfigPaths({
//       projects: ["./tsconfig.json"],
//     }),
//     tanstackStart({
//       target: "bun",
//       customViteReactPlugin: true,
//     }),
//     viteReact(),
//   ],
// });

// import { lingui } from "@lingui/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: 3001,
  },
  build: {
    target: "esnext",
  },
  plugins: [
    // lingui(),
    nitro(),
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact({
      // babel: {
      //   plugins: ["@lingui/babel-plugin-lingui-macro"],
      // },
    }),
  ],
  ssr: {
    noExternal: ["ms"],
  },
  nitro: {
    preset: "aws-lambda",
    awsLambda: {
      streaming: false,
    },
  },
});
