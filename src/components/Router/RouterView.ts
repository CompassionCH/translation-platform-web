import { Component, onMounted, onWillUpdateProps, useState, xml } from "@odoo/owl";
import { RoutePayload, Route } from "./Router";
import { ComponentConstructor } from "@odoo/owl/dist/types/component/component";


type Props = {
  route: RoutePayload;
};

type State = {
  component: ComponentConstructor | null,
  route: Route | null,
  routeProps: Record<string, string | number> | null,
};

/**
 * A simple component responsible for resolving the given route's component
 * and mounting it in the viewport
 */
class RouterView extends Component<Props> {

  static template = xml`
    <t
      t-if="state.route"
      t-component="state.component"
      t-props="state.routeProps" />
  `;

  static props = {
    route: { type: Object, optional: true },
  };

  state = useState<State>({
    component: null,
    route: null,
    routeProps: null,
  });

  setup() {
    onMounted(() => this.mountRoute(this.props));
    onWillUpdateProps((nextProps) => this.mountRoute(nextProps));
  }

  async mountRoute(props: Props) {
    if (!props.route) {
      this.state.route = null;
      this.state.routeProps = null;
      this.state.component = null;
      return;
    }

    const { route, params } = props.route;
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
    this.state.routeProps = params || {};
  }
};

export default RouterView;