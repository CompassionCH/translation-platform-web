import { Component, xml } from '@odoo/owl';
import Tippy from '../../components/Tippy';
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
    <Tippy placement="'right'" content="_(props.tooltip)">
      <div class="relative w-20 h-20 flex justify-center items-center transition-colors"
        t-att-class="{
          [props.class]: true,
          'bg-gradient-to-b from-slate-100 to-sky-50 text-compassion': props.active,
          'text-white hover:bg-black-10': !props.active,
        }">
        <t t-slot="default" />
      </div>
    </Tippy>
  `;

  _ = _;

  static props = {
    tooltip: { type: String },
    active: { type: Boolean, optional: true },
    class: { type: String, optional: true },
    '*': {},
  };

  static components = {
    Tippy,
  };
};

export default MenuButton;