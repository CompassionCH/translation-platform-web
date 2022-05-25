import { Component } from '@odoo/owl';
import template from './index.xml';
import MainMenu from './Menu';
import Router, { Route } from '../components/Router';

export default class Root extends Component {
  static template = template;
  static components = {
    MainMenu,
    Router,
  };

  routes: Route[] = [
    {
      component: () => import('../pages/Home'),
      name: 'home',
      path: '/',
    },
    {
      component: () => import('../pages/Users'),
      name: 'users',
      path: '/users',
    },
    {
      component: () => import('../pages/TextEdit'),
      name: 'text-edit',
      path: '/text-edit/:textId',
    }
  ];
}