 # Translation Platform Frontend

This project holds the source code for the translation platform web application
built with [Owl](https://github.com/odoo/owl) and [Vite](https://vitejs.dev/). It is developed in Typescript and styled using [Tailwind](https://tailwindcss.com/)

## Developing
1. Clone this repository and install dependencies with `npm install`
2. Launch the Vite development server with `npm run dev`
3. Access it on `http://localhost:3000`

## Technical Information
The application in itself is built with Owl as reactive framework. Owl offers various useful primitives such as a component structure, data bindings and a template engine, but no ready-to-use components. Thus multiple components have been developed to address that, including but not limited to:
- A frontend router working with the Javascript History
- A central store built with Odoo's primitives
- A transition component to mount and unmount components according to CSS transitions
- Multiple reusable visual components (Modal, Table, Button...)

## Code structure
The code is divided in the following directories and "main" files:
- `/src/main.ts` is the entry point, it loads Owl and mounts the layout component
- `/src/icons.ts` lists and loads the various icons from FontAwesome
- `/src/notifications.ts` defines a notification object based on [Notyf](https://github.com/caroso1222/notyf) to display small notifications to the user
- `/src/routes.ts` declares the various routes and navigation guards of the application
- `/src/store.ts` defines the central store
- `/public` contains the various static files such as pictures
- `/src/components` contains the various reusable components and components shared by multiple pages
- `/src/hooks` contains a few useful hooks to use in components
- `/src/models` contains the API abstractions and DAOs used by the components to get and update data
- `/src/pages` contains the page components, mounted by the router

Note that each file contains documentation about what it does, as such each component is documented in the file where it is defined.

## Loading templates in components
The structure of the application makes it easier to define a template as close as possible
to its component definition. The Owl way of doing it is be setting an inline string in the static
`template` field of a component class. It is nice for small components but once it grows it becomes
harder to maintain, furthermore we have much less developer tooling (unable to recognize it is XML).

Thus a small vite plugin is set in `/vite.config.js` to load XML files as Odoo templates. It is thus
possible to do the following:
```ts
import { Component } from '@odoo/owl';
import componentTemplate from './template.xml'; // important to give the extension

class MyComponent extends Component {
  static template = componentTemplate;
  // ...
}
```
Note that the plugin will automatically pass the content of the XML file in Owl's `xml` template string
function.