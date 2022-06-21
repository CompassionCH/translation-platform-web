import { Component } from '@odoo/owl';
import template from './layout.xml';
import Router from '../../components/Router/Router';
import RouterView from '../../components/Router/RouterView';
import RouterLink from '../../components/Router/RouterLink';
import Icon from '../../components/Icon';
import MenuButton from './MenuButton';
import { routes, guards } from '../../routes';
import { useStore, watchStore } from '../../store';

export default class Root extends Component {
  static template = template;
  static components = {
    Router,
    Icon,
    RouterLink,
    MenuButton,
    RouterView,
  };

  routes = routes;
  guards = guards;
  store = useStore();
  
  setup() {
    watchStore((store) => {
      if (!store.user) {
        window.history.pushState({}, "", '/login');
      }
    });
  }
}