import { Component, useState, xml } from '@odoo/owl';
import Transition from '../../components/Transition';

type Props = {
  tooltip: string;
};

class MenuButton extends Component<Props> {
  static template = xml`
    <div class="relative w-20 h-20 flex justify-center items-center transition-colors"
      t-att-class="{
        [props.class]: true,
        'bg-gradient-to-b from-slate-100 to-sky-50 text-compassion': props.active,
        'text-white hover:bg-black-10': !props.active,
      }"
      t-on-mouseenter="() => this.state.tooltipVisible = true"
      t-on-mouseleave="() => this.state.tooltipVisible = false"
    >
      <Transition duration="300"
        active="state.tooltipVisible"
        enterFrom="'opacity-0'"
        enterTo="'opacity-1'"
        leaveFrom="'opacity-1'"
        leaveTo="'opacity-0'"
        enterActive="'transition-all duration-300'"
        leaveActive="'transition-all duration-300'"
        t-slot-scope="scope"
        delay="200"
      >
        <div class="absolute bg-black-90 shadow whitespace-nowrap rounded-sm p-3 ml-6 text-white text-sm left-16 tooltip-arrow-left" t-att-class="scope.itemClass" t-esc="props.tooltip" />
      </Transition>
      <t t-slot="default" />
    </div>
  `;

  static props = {
    tooltip: { type: String },
    active: { type: Boolean, optional: true },
    class: { type: String, optional: true },
    '*': {},
  };

  static components = {
    Transition,
  };

  state = useState({
    tooltipVisible: false,
  });
};

export default MenuButton;