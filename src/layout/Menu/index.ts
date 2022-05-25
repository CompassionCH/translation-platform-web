import { Component } from '@odoo/owl';
import template from './menu.xml';
import RouterLink from '../../components/RouterLink';


export default class Menu extends Component {
  static template = template;
  static components = {
    RouterLink,
  };
}