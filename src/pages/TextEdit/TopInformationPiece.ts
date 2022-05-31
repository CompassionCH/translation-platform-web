import { Component, xml } from "@odoo/owl";

class TopInformationPiece extends Component {

  static template = xml`
    <div class="flex text-sm">
      <p class="w-32 text-slate-700 font-medium" t-esc="props.label" />
      <p class="text-slate-800" t-esc="props.value" />
    </div>
  `;

  static props = ['label', 'value'];
}

export default TopInformationPiece;