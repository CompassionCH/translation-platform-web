import { Component, xml } from "@odoo/owl";
import Icon from "../Icon";

class SortOrderViewer extends Component {

  static template = xml`
    <div class="flex flex-col relative ml-2 text-slate-800 text-xs">
      <Icon icon="'caret-up'" class="{
        'h-1.5': true,
        'opacity-30': props.order !== 'asc',
      }" />
      <Icon icon="'caret-down'" class="{
        'h-1': true,
        'opacity-30': props.order !== 'desc',
      }" />
    </div>
  `;

  static components = {
    Icon,
  };

  static props = {
    order: { type: String, optional: true },
  }
}

export default SortOrderViewer;