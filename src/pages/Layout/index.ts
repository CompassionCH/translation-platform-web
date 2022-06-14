import { Component } from '@odoo/owl';
import template from './layout.xml';
import Router from '../../components/Router/Router';
import RouterLink from '../../components/Router/RouterLink';
import Icon from '../../components/Icon';
import MenuButton from './MenuButton';
import routes from '../../routes';

export default class Root extends Component {
  static template = template;
  static components = {
    Router,
    Icon,
    RouterLink,
    MenuButton,
  };

  routes = routes;
}