import { Component, onMounted, onWillUpdateProps, useState, xml } from "@odoo/owl";

type Props = {
  active: boolean;
  forceInitialTransition: boolean;
  duration: number;
  enterActive: string;
  leaveActive: string;
  enterFrom: string;
  enterTo: string;
  leaveFrom: string;
  leaveTo: string;
  delay: number;
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

  static defaultProps = {
    enterFrom: 'opacity-0',
    enterTo: 'opacity-1',
    leaveFrom: 'opacity-1',
    leaveTo: 'opacity-0',
    enterActive: 'transition-opacity duration-300',
    leaveActive: 'transition-opacity duration-300',
    delay: 100,
    duration: 300,
  };

  state = useState({
    class: '',
    show: this.props.active,
    timer: null as number | null,
  });

  setup(): void {
    onMounted(() => {
      this.computeClasses({
        ...this.props,
        active: this.props.forceInitialTransition ? true : this.props.active,
      });

      if (this.props.forceInitialTransition) {
        setTimeout(() => this.computeClasses({ ...this.props, active: this.props.active }), 10);
      }
    });

    onWillUpdateProps((nextProps) => this.computeClasses(nextProps));
  }

  computeClasses(props: Required<Props>) {
    const previousActive = this.props.active;
    const {
      active,
      enterActive,
      leaveActive,
      enterFrom,
      enterTo,
      leaveFrom,
      leaveTo,
      delay,
    } = props;
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
  }

  private setClass(...cls: string[]) {
    this.state.class = cls.filter(it => it).join(' ');
  }
};

export default Transition;