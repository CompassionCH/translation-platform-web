import { Component, useState } from '@odoo/owl';
import template from './layout.xml';
import Router, { navigateTo } from '../../components/Router/Router';
import RouterView from '../../components/Router/RouterView';
import RouterLink from '../../components/Router/RouterLink';
import Icon from '../../components/Icon';
import MenuButton from './MenuButton';
import { BlurLoader } from '../../components/Loader';
import { routes, guards } from '../../routes';
import { clearStoreCache, useStore, watchStore } from '../../store';
import useCurrentUser from '../../hooks/useCurrentUser';

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
    Icon,
    RouterLink,
    MenuButton,
    RouterView,
    BlurLoader,
  };

  routes = routes;
  guards = guards;
  store = useStore();
  user = useCurrentUser();
  state = useState({
    loading: false,
  });

  setup() {
    if (!this.user.data) {
      // Fetch current user data if not already here
      // Login page loads it to have a single spinner displayed to user
      this.refreshUser();
    }

    // Watch store to redirect user if he's not authenticated, I.E
    // no info about him are in store
    watchStore((store) => {
      if (!store.username || !store.userId || !store.password) {
        navigateTo("/login");
      } else if (!this.user.data) {
        this.refreshUser();
      }
    });
  }

  async refreshUser() {
    // Store loading in separate value so that the whole loader is not
    // displayed whenever a component refresh user instance
    this.state.loading = true;
    await this.user.refresh();
    this.state.loading = false;
  }

  logout() {
    // Clear session storage and reload page, efficient, clean, simple, bim bim
    clearStoreCache();
    window.location.reload();
  }
}