import { Component, xml } from "@odoo/owl";
import Icon from './Icon';

class Checkbox extends Component {

  static template = xml`
    <div class="w-4 h-4 flex items-center justify-center rounded cursor-pointer border-solid border shadow-sm focus:border-blue-300 focus:ring focus:ring-offset-0 focus:ring-blue-200 focus:ring-opacity-50" t-att-class="{
      'bg-compassion border-compassion': props.checked,
      'bg-white border-gray-300': !props.checked,
    }" t-on-click.stop="props.onClick">
      <Icon icon="'check'" class="'text-xs text-white'" t-if="props.checked" />
    </div>
  `;

  static props = ['onClick', 'checked'];
  static components = {
    Icon,
  };
}

export default Checkbox;