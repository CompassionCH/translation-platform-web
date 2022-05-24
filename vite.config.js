import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
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