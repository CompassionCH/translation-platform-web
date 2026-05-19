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

  // VITE_DEV_PROXY_TARGET sets where `npm run dev` proxies the Odoo
  // backend (`/auth/*` and `/xmlrpc/*`). When set, the webapp can
  // leave VITE_ODOO_URL empty and call relative paths; the browser
  // sees same-origin requests and the dev server forwards them.
  // This avoids the Odoo-side CORS gap on `/xmlrpc/2/*` (which has
  // no `cors=` declared in stock v18).
  const devProxyTarget = env.VITE_DEV_PROXY_TARGET || "http://localhost:8069";

  return {
    base: env.SERVE_URL,
    server: {
      proxy: {
        "/auth": { target: devProxyTarget, changeOrigin: true },
        "/xmlrpc": { target: devProxyTarget, changeOrigin: true },
      },
    },
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
