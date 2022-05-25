import { Component } from "@odoo/owl";
import template from './routerLink.xml';

export default class RouterLink extends Component {
  static template = template;
  static props = ["to"];

  moveTo() {
    window.history.pushState({
      
    }, "", this.props.to);
    console.log(this.props.to);
  }
}