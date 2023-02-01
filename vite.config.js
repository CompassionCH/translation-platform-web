import { defineConfig, loadEnv } from "vite";

/**
 * We define a small home made Vite plugin to be able to load xml file
 * as Odoo template strings. It is thus possible to do the following:
 *
 * import template from './template.xml';
 * const X extends Component {
 *  static template = template;
 * }
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: env.SERVE_URL,
    build: {
      commonjsOptions: {
        ignoreTryCatch: (id) => id !== "stream",
      },
    },
    resolve: {
      alias: {
        stream: "stream-browserify",
        events: "events",
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: "globalThis",
        },
      },
    },
    plugins: [
      {
        name: "vite-template-plugin",
        transform(src, id) {
          if (id.endsWith(".xml")) {
            return {
              map: null,
              code: `
              import { xml } from "@odoo/owl";
              export default ${"xml`" + src + "`"};
              `,
            };
          }
        },
      },
    ],
  };
});
