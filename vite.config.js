import { defineConfig } from 'vite';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

/**
 * We define a small home made Vite plugin to be able to load xml file
 * as Odoo template strings. It is thus possible to do the following:
 * 
 * import template from './template.xml';
 * const X extends Component {
 *  static template = template;
 * }
 */
export default defineConfig({
  resolve: {
    alias: {
      stream: 'stream-browserify',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  plugins: [
    NodeGlobalsPolyfillPlugin({
      buffer: true
    }),
    {
      name: 'vite-template-plugin',
      transform(src, id) {
        if (id.endsWith('.xml')) {
          return {
            map: null,
            code: `
            import { xml } from "@odoo/owl";
            export default ${"xml`" + src + "`"};
            `,
          }
        }
      }
    }
  ]
});