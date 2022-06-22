import { Component, useState, xml } from '@odoo/owl';
import Transition from '../../components/Transition';
import _ from '../../i18n';

type Props = {
  tooltip: string;
};

/**
 * A button of the main menu on the left side of the viewport. It displays
 * tooltips when the user passes the mouse over it.
 */
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
      <Transition active="state.tooltipVisible" t-slot-scope="scope" delay="200">
        <div class="absolute bg-black-90 shadow whitespace-nowrap rounded-sm p-3 ml-6 text-white text-sm left-16 tooltip-arrow-left" t-att-class="scope.itemClass" t-esc="_(props.tooltip)" />
      </Transition>
      <t t-slot="default" />
    </div>
  `;

  _ = _;

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