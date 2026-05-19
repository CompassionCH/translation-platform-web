 # Translation Platform Frontend

This project holds the source code for the translation platform web application
built with [Owl](https://github.com/odoo/owl) and [Vite](https://vitejs.dev/). It is developed in Typescript and styled using [Tailwind](https://tailwindcss.com/)

## Developing
1. Clone this repository and install dependencies with `npm install`
2. Create a `.env.local` environment file based on the `.env` example one
3. Launch the Vite development server with `npm run dev`
4. Access it on `http://localhost:3000`

## Building for production
1. Create a `.env.production.local` environment file based on the `.env.local` example one and fill it
2. Run `npm run build`, it will build static files in the `/dist` directory
3. Copy those files wherever you want

## Running against Odoo 18

The backend module is `auth_external` (in
`compassion-switzerland/compassion-switzerland/auth_external`). It
exposes:

- `POST /auth/login {login, password, totp}` → `{user_id, auth_tokens: {access_token, refresh_token, expires_at}}`
- `POST /auth/refresh {refresh_token}` → rotated `auth_tokens`
- `POST /auth/logout {refresh_token}` → revoke family

Subsequent XML-RPC calls authenticate via the `Authorization: Bearer
<access_token>` header (set automatically by `OdooAPI.ts`) with
`password='None'` in the `execute_kw` arguments. The Odoo-side
`res.users.check` override in `auth_external` validates the header.

### Deployment modes

**1. Served by Odoo (production / staging).** Run `npm run build` and
copy `dist/*` into `sbc_translation/static/tp/`. The
`TranslationPlatformController` in `sbc_translation/controllers/main.py`
serves the SPA at `/translation-platform`. The SPA and the Odoo API
share the same origin, so no CORS concerns.

Set in `.env.production.local`:

```
SERVE_URL="/translation-platform/"
VITE_ODOO_URL=""
VITE_ODOO_DBNAME="<prod db>"
```

**2. `npm run dev` against a local Odoo (local development).** This
is the recommended dev workflow. The Vite dev server proxies the
`/auth/*` and `/xmlrpc/*` paths to your local Odoo, so the browser
sees same-origin requests and there is no CORS preflight to deal
with.

Set in `.env.local`:

```
SERVE_URL="/"
VITE_ODOO_URL=""
VITE_ODOO_DBNAME="<your test db>"
# Only override if Odoo isn't on the default port/host:
# VITE_DEV_PROXY_TARGET="http://localhost:8069"
```

Then `npm run dev` and open <http://localhost:3000>.

**3. Cross-origin hosting (non-default).** If you ever need the SPA
to live on a different host from Odoo, you have to enable CORS on
`/xmlrpc/2/*` (stock v18 declares `cors=` only on `/auth/*`). Do it
narrowly, set the `cors=` value to the exact origin of the SPA, not
`"*"`, and only on that endpoint. Neither of the two recommended
deployments above triggers a CORS preflight (both are same-origin),
so we don't ship such an override.

## Environment files
Please read the [vite documentation](https://vitejs.dev/guide/env-and-mode.html#modes). Mainly, environment files are loaded based
on their name given the running mode:
- running `npm run dev` will load the `.env.local` file
- running `npm run build` will first load `.env.local` and then the `.env.production.local` file overriding any values

The `.local` part of the filename indicates that it must not be commited.

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
- `/src/i18n` contains translations related stuff

Note that each file contains documentation about what it does, as such each component is documented in the file where it is defined.

### Loading templates in components
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

### Translations

Translations are, as much as possible, handled using Owl's internal translation function, it is
defined in `/src/i18n/index.ts`. Simply put the translation method defined will attempt to replace
any string given by Owl, and fallback to what's provided, which should be in english.

#### Adding a new language

Defining new languages is done by first creating a file for it (take example on `/src/i18n/fr.ts`)
and translating the various strings found in it. You can then register it in the `index.ts` file under
dictionnaries with the minified lang representation as key.

You can then register your new language in `/src/components/SettingsModal.ts` in the `languages` field
of the component.

#### Detecting missing translations

Whenever a missing translation is found it will be logged to the browser's console. you can easily dump
the various missing translations by running `dumpMissingTranslations()` in your browser console, which will
log a JSON object containing them.

#### ODOO Dev environment and CORS requests (legacy v12/v14)

> **For v18:** prefer the Vite dev proxy described in the "Running
> against Odoo 18" section above — it sidesteps CORS entirely without
> touching Odoo's source. The patch below is kept for historical
> reference and for v12/v14 setups only.

When running the platform in dev environment, you will very probably run into a cross-origin requests
problem. To fix it quick and dirty, edit the `/odoo/service/wsgi_server.py` in Odoo's source code.
Patch the `application_unproxied` function like so:

```python
  def application_unproxied(environ, start_response):
    """ WSGI entry point."""
    # cleanup db/uid trackers - they're set at HTTP dispatch in
    # web.session.OpenERPSession.send() and at RPC dispatch in
    # odoo.service.web_services.objects_proxy.dispatch().
    # /!\ The cleanup cannot be done at the end of this `application`
    # method because werkzeug still produces relevant logging afterwards
    if hasattr(threading.current_thread(), 'uid'):
        del threading.current_thread().uid
    if hasattr(threading.current_thread(), 'dbname'):
        del threading.current_thread().dbname
    if hasattr(threading.current_thread(), 'url'):
        del threading.current_thread().url

    if environ['REQUEST_METHOD'] == "OPTIONS":
        response = werkzeug.wrappers.Response('OPTIONS METHOD DETECTED')
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
        response.headers['Access-Control-Max-Age'] = 1000
        # note that '*' is not valid for Access-Control-Allow-Headers
        response.headers['Access-Control-Allow-Headers'] = 'origin, x-csrftoken, content-type, accept, authorization'
        return response(environ, start_response)



    with odoo.api.Environment.manage():
        result = odoo.http.root(environ, start_response)
        if result is not None:
            return result

    # We never returned from the loop.
    return werkzeug.exceptions.NotFound("No handler found.\n")(environ, start_response)
```

Then you also have to update the `/odoo/addons/base/controllers/rpc.py`, update both `xmlrpc/2/<service>` and `/xmlrpc/<service>` route params
```python
@route("/xmlrpc/<service>", auth="none", methods=["POST"], csrf=False, save_session=False, cors='*')

@route("/xmlrpc/2/<service>", auth="none", methods=["POST"], csrf=False, save_session=False, cors='*')
```
By adding the `cors="*"` parameter.

Note that this only tested with Odoo 12 and 14 and responds accordingly to the preflight Option request.
