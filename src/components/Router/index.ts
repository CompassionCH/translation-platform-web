import { Component, onMounted, onWillDestroy, useState } from "@odoo/owl";
import { ComponentConstructor } from "@odoo/owl/dist/types/component/component";

import template from './router.xml';
import pathMatch from "./pathMatch";

export type Route = {
  component: ComponentConstructor | Promise<ComponentConstructor> | (() => Promise<any>),
  path: string,
  name: string,
};

type Props = {
  routes: Route[];
  basePath?: string;
};

type State = {
  component: ComponentConstructor | null,
  route: Route | null,
  routeProps: Record<string, string> | null,
};

export default class Router extends Component<Props> {
  static template = template;
  static props = ['routes'];

  state = useState<State>({
    component: null,
    route: null,
    routeProps: null,
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
        let resolvableComponent = route.component;
        if (typeof resolvableComponent === 'function') {
          // @ts-ignore
          resolvableComponent = resolvableComponent();
        }

        const resolvedComponent = await Promise.resolve(resolvableComponent);
        // @ts-ignore
        const component = "default" in resolvedComponent ? resolvedComponent.default : resolvedComponent;

        this.state.component = component;
        this.state.route = route;
        this.state.routeProps = routeProps;
        return;
      }
    }

    this.state.route = null;
    this.state.component = null;
    this.state.routeProps = null;
  }
}