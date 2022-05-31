import { Component } from '@odoo/owl';
import template from './layout.xml';
import Router, { Route } from '../components/Router/Router';
import RouterLink from '../components/Router/RouterLink';
import Icon from '../components/Icon';
import MenuButton from './MenuButton';

export default class Root extends Component {
  static template = template;
  static components = {
    Router,
    Icon,
    RouterLink,
    MenuButton,
  };

  routes: Route[] = [
    {
      component: () => import('../pages/Home'),
      name: 'Home',
      path: '/',
    },
    {
      component: () => import('../pages/Users'),
      name: 'Users',
      path: '/users',
    },
    {
      component: () => import('../pages/TextEdit'),
      name: 'Texts',
      path: '/text-edit/:textId',
    }
  ];
}