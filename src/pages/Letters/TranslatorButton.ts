import { Component, xml } from "@odoo/owl";

class TranslatorButton extends Component {

  static props = ['translatorId', 'onClick'];
  static template = xml`
    <button class="text-blue-600 hover:text-compassion" t-esc="props.translatorId" t-on-click="props.onClick" />
  `;
}

export default TranslatorButton;