import { Component, useState } from "@odoo/owl";
import template from './template.xml';

export class Root extends Component {
  static template = template;

  state = useState({ text: "Owl" });
  update() {
    this.state.text = this.state.text === "Owl" ? "World" : "Owl";
  }
}