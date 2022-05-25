import { Component } from '@odoo/owl';
import template from './menu.xml';
import Router, { Route } from '../../components/Router';
import RouterLink from '../../components/RouterLink';

type Props = {
  routes: Route[];
};

export default class Menu extends Component<Props> {
  static template = template;
  static props = ['routes'];
  static components = {
    Router,
    RouterLink,
  };
}