import { Component, xml } from "@odoo/owl";

class TranslatorButton extends Component {

  static props = ['username', 'onClick'];
  static template = xml`
    <button class="text-blue-600 hover:text-compassion" t-esc="props.username" t-on-click="props.onClick" />
  `;
}

export default TranslatorButton;