import { Component } from "@odoo/owl";
import template from './letterView.xml';

class LetterView extends Component {
  static template = template;

  static props = {
    letterId: { type: String },
  };
}

export default LetterView;