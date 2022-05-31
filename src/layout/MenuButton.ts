import { Component, useState, xml } from '@odoo/owl';
import Transition from '../components/Transition';

type Props = {
  tooltip: string;
};

class MenuButton extends Component<Props> {
  static template = xml`
    <div class="relative w-14 h-14 flex justify-center items-center rounded-full hover:bg-black-10 transition-colors text-white"
      t-att-class="props.class || ''"
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
        <div class="absolute bg-black-90 shadow rounded p-3 text-white text-sm left-16 tooltip-arrow-left" t-att-class="scope.itemClass" t-esc="props.tooltip" />
      </Transition>
      <t t-slot="default" />
    </div>
  `;

  static props = ['tooltip', 'class', '*'];
  static components = {
    Transition,
  };

  state = useState({
    tooltipVisible: false,
  });
};

export default MenuButton;