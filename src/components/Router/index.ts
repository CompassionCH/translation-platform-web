import { Component, onMounted, onWillDestroy, useState } from "@odoo/owl";
import template from './router.xml';
import pathMatch from "./pathMatch";

export type Route = {
  component: typeof Component,
  path: string,
  name: string,
};

type Props = {
  routes: Route[];
  basePath?: string;
};

type State = {
  currentRoute: Route | null,
  currentProps: Record<string, string> | null,
};

export default class Router extends Component<Props> {
  static template = template;
  static props = ['routes'];

  state = useState<State>({
    currentRoute: null,
    currentProps: null,
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

  loadRoute() {
    const { pathname } = new URL(window.location.href);
    const currentPath = pathname.replace(this.props.basePath || '', '');

    for (const route of this.props.routes) {
      const routeProps = pathMatch(currentPath, route.path);
      if (routeProps) {
        this.state.currentRoute = route;
        this.state.currentProps = routeProps;
        return;
      }
    }

    this.state.currentRoute = null;
    this.state.currentProps = null;
}
}