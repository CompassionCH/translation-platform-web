import { Guard, Route } from "./components/Router/Router";
import t_ from "./i18n";
import store from "./store";

/**
 * The first route matching by path is taken, so more generic routes
 * such as /letters must come after /letters/letter-edit/:letterId for example.
 * Except for the home route which is matched strictly
 */
const routes: Route[] = [
  {
    // Note that using this callback version coupled with import will load
    // the component asynchronously, which is nice
    component: () => import('./pages/Home'),
    name: 'Home',
    path: '/',
  },
  {
    component: () => import('./pages/Translators'),
    name: 'Translators',
    path: '/translators',
  },
  {
    component: () => import('./pages/LetterView'),
    name: 'View Letter',
    // You can define parameters in your route paths, they will be available as
    // props in your page components
    path: '/letters/letter-view/:letterId',
  },
  {
    component: () => import('./pages/LetterEdit/LetterEditDemo'),
    name: 'Edit Letter Demo',
    path: '/letters/demo-edit-letter'
  },
  {
    component: () => import('./pages/LetterEdit'),
    name: 'Edit Letter',
    path: '/letters/letter-edit/:letterId',
  },
  {
    component: () => import('./pages/Letters'),
    name: 'Letters',
    path: '/letters',
  },
  {
    component: () => import('./pages/Login'),
    name: 'Login',
    path: '/login',
  }
];

/**
 * Global authentication guards are ran sequentially whenever the
 * URL path changes.
 */
const guards: Guard[] = [
  // Authentication guard to redirect to login if not authenticated
  async (_, to) => {
    if (!store.userId && to !== 'Login') {
      return '/login';
    } else {
      return;
    }
  },

  // Guard to redirect to home page if already authenticated
  async (_, to) => {
    if (store.userId && to === 'Login') {
      return '/';
    } else {
      return;
    }
  },

  // Guard to update page title when routing somewhere
  async (_, to) => {
    const title = (to ? t_(to) + " | " : '') + t_("Compassion Translation Platform");
    document.title = title;
  },
];

export {
  routes,
  guards,
};