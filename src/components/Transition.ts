import { Component, onWillUpdateProps, useState, xml } from "@odoo/owl";

type Props = {
  active: boolean;
  duration?: number;
  enterActive?: string;
  leaveActive?: string;
  enterFrom?: string;
  enterTo?: string;
  leaveFrom?: string;
  leaveTo?: string;
  delay?: number;
};

class Transition extends Component<Props> {

  static template = xml`
    <t t-if="state.show" t-slot="default" itemClass="state.class" />
  `;

  static props = {
    active: { type: Boolean },
    duration: { type: Number, optional: true },
    enterActive: { type: String, optional: true },
    leaveActive: { type: String, optional: true },
    enterFrom: { type: String, optional: true },
    enterTo: { type: String, optional: true },
    leaveFrom: { type: String, optional: true },
    leaveTo: { type: String, optional: true },
    delay: { type: Number, optional: true },
    "*": {},
  };

  state = useState({
    class: '',
    show: this.props.active,
    timer: null as number | null,
  });

  setup(): void {
    onWillUpdateProps((nextProps) => {
      const {
        active,
        enterActive,
        leaveActive,
        enterFrom,
        enterTo,
        leaveFrom,
        leaveTo,
        delay,

      } = nextProps;
      if (this.state.timer) {
        clearTimeout(this.state.timer);
      }

      if (active) {
        // Show element
        this.state.show = true;
        this.setClass(enterActive, enterFrom);
        this.state.timer = setTimeout(() => {
          this.setClass(enterActive, enterTo);
        }, 5 + (delay || 0));

      } else {
        // Hide element
        this.setClass(leaveActive, leaveFrom);
        this.state.timer = setTimeout(() => {
          this.setClass(leaveActive, leaveTo);
          this.state.timer = setTimeout(() => {
            this.state.show = false;  
          }, (this.props.duration || 200) - 10);
        }, 10);
      }
    });
  }

  private setClass(...cls: string[]) {
    this.state.class = cls.filter(it => it).join(' ');
  }
};

export default Transition;