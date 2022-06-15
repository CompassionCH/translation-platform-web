import { Component, xml } from "@odoo/owl";

class TableHeader extends Component {
  static template = xml`
    <div class="flex justify-between border-b border-solid border-slate-200 py-4 px-2 items-center">
      <p class="transition text-sm px-2" t-att-class="{
        'text-slate-400': props.selected === 0,
        'text-slate-800': props.selected > 0,
      }">
        <span t-esc="props.selected" /> <span t-esc="props.name || 'Items'" /> Selected
      </p>
      <div class="flex items-center pr-2">
        <t t-slot="default" />
      </div>
    </div>
  `;

  static props = {
    selected: { type: Number },
    name: { type: String, optional: true },
    '*': {},
  }
}

export default TableHeader;