import { Component, onMounted, onWillDestroy, useState, xml } from "@odoo/owl";
import pathMatch from "./pathMatch";
import { navigateTo } from "./Router";

class RouterLink extends Component {
  static template = xml`
    <div t-on-click="moveTo" class="cursor-pointer">
      <t t-slot="default" active="state.active" />
    </div>
  `;

  static props = {
    to: { type: String },
    basePath: { type: String, optional: true },
    "*": {},
  };

  static defaultProps = {
    basePath: '',
  };

  state = useState({
    active: false,
  });

  moveTo() {
    navigateTo(this.props.to);
  }

  // TODO: Refactor code with Router
  setup(): void {

    const defaultPushState = window.history.pushState;
    const loadRouteListener = () => this.checkMatch();

    onMounted(() => {
      this.checkMatch();
      window.history.pushState = new Proxy(window.history.pushState, {
        apply: (target, thisArg, argArray) => {
          // @ts-ignore
          const res = target.apply(thisArg, argArray);
          this.checkMatch();
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

  checkMatch(): void {
    // Check if match
    const { pathname } = new URL(window.location.href);
    const currentPath = pathname.replace(this.props.basePath || '', '');
    const match = pathMatch(currentPath, this.props.to);

    if (match) {
      this.state.active = true;
    } else {
      this.state.active = false;
    }
  }
};

export default RouterLink;