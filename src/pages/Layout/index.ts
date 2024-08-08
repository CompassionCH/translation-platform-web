import { Component, useState } from '@odoo/owl';
import template from './layout.xml';
import Router, { navigateTo } from '../../components/Router/Router';
import RouterView from '../../components/Router/RouterView';
import { BlurLoader } from '../../components/Loader';
import { routes, guards } from '../../routes';
import store, { useStore } from '../../store';
import useCurrentTranslator from '../../hooks/useCurrentTranslator';
import Menu from './Menu';
import _ from '../../i18n';
import { ConfirmModal } from '../../hooks/useAlerts';

/**
 * The Layout component is the root component of the application.
 * It is responsible for mounting the router, declaring routes and redirecting
 * the user to the login page if he's not authenticated.
 * 
 * Furthermore it will load the current user using the useCurrentUser hook so
 * that other components do not have to do it. If user info is already in session,
 * it will display a loader for it, otherwise the Login page will have already
 * done it.
 */
export default class Layout extends Component {
  static template = template;
  static components = {
    Router,
    ConfirmModal,
    RouterView,
    BlurLoader,
    Menu,
  };

  routes = routes;
  guards = guards;
  store = useStore();
  currentTranslator = useCurrentTranslator();
  state = useState({
    loading: false,
  });

  _ = _;

  setup() {
    this.checkStore();
  }

  checkStore() {
    if (!store.username || !store.userId || !store.password) {
      navigateTo("/login");
    } else if (!this.currentTranslator.data) {
      this.refreshCurrentTranslator();
    }
  }

  async refreshCurrentTranslator() {
    // Store loading in separate value so that the whole loader is not
    // displayed whenever a component refresh user instance
    this.state.loading = true;
    try {
      await this.currentTranslator.refresh();
    }
    finally {
      this.state.loading = false;
    }
  }
}