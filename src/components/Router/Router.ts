import { Component, onMounted, onWillDestroy, useState, xml } from "@odoo/owl";
import { ComponentConstructor } from "@odoo/owl/dist/types/component/component";
import RouterView from "./RouterView";
import pathMatch from "./pathMatch";

export type Route = {
  component: ComponentConstructor | Promise<ComponentConstructor> | (() => Promise<any>),
  path: string,
  name: string,
  guards?: Guard[],
};

/**
 * A guard is executed right before a routing is performed and a route is mounted
 * It must return a string which is the destination route name or nothing to keep
 * on with the routing flow
 */
export type Guard = (from: string | null, to: string | null, routes: Route[]) => Promise<string | void>;


type Props = {
  routes: Route[];
  guards?: Guard[];
  basePath?: string;
};

export type RoutePayload = {
  route: Route;
  params?: Record<string, string | number>;
}

type State = {
  route?: RoutePayload;
};

export default class Router extends Component<Props> {
  static template = xml`
    <t t-slot="default" currentRoute="state.route">
      <RouterView route="state.route" />
    </t>
  `;

  static props = ['routes', 'guards', 'slots'];

  static components = {
    RouterView,
  };

  state = useState<State>({
    route: undefined,
  });

  setup(): void {

    const defaultPushState = window.history.pushState;
    const loadRouteListener = () => this.loadRoute();

    onMounted(() => {
      this.loadRoute();
      window.history.pushState = new Proxy(window.history.pushState, {
        apply: (target, thisArg, argArray) => {
          // @ts-ignore
          const res = target.apply(thisArg, argArray);
          this.loadRoute();
          return res;
        },
      });

      window.addEventListener('popstate', loadRouteListener);
    });

    onWillDestroy(() => {
      window.history.pushState = defaultPushState;
      window.removeEventListener('popstate', loadRouteListener);
    });
  }

  async loadRoute() {
    const { pathname } = new URL(window.location.href);
    const currentPath = pathname.replace(this.props.basePath || '', '');

    for (const route of this.props.routes) {
      const routeProps = pathMatch(currentPath, route.path);
      if (routeProps) {

        const guardInterrupt = await this.runGuards(this.state.route?.route.name, route.name);
        if (guardInterrupt) {
          // Route change, stop current flow
          window.history.pushState({}, "", guardInterrupt);
          return;
        }

        this.state.route = {
          route,
          params: routeProps,
        };

        return;
      }
    }

    // Run guards even if we dont know where we're going or where we're from
    const guardInterrupt = await this.runGuards(this.state.route?.route.name, undefined);
    if (guardInterrupt) {
      // Route change, stop current flow
      window.history.pushState({}, "", guardInterrupt);
      return;
    }

    this.state.route = undefined;
  }

  async runGuards(from?: string, to?: string) {
    const routeGuards = to ? this.props.routes.find(it => it.name === to)?.guards || [] : [];
    const guards = [...this.props.guards || [], ...routeGuards];
    for await (const guard of guards) {
      const nextRoute = await guard(from || null, to || null, this.props.routes);
      if (nextRoute) {
        return nextRoute;
      }
    }

    return null; // Keep on with the flow
  }
}