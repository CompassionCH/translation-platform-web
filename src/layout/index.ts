import { Component } from '@odoo/owl';
import template from './index.xml';
import MainMenu from './Menu';
import Router, { Route } from '../components/Router';

import Home from '../pages/Home';
import Users from '../pages/Users';

export default class Root extends Component {
  static template = template;
  static components = {
    MainMenu,
    Router,
  };

  routes: Route[] = [
    {
      component: Home,
      name: 'home',
      path: '/',
    },
    {
      component: Users,
      name: 'users',
      path: '/users',
    },
  ];
}