import { Guard, Route } from "./components/Router/Router";
import store from "./store";

/**
 * The first route matching by path is taken, so more generic routes
 * such as /letters must come after /letters/letter-edit/:letterId for example.
 * Except for the home route which is matched strictly
 */
const routes: Route[] = [
  {
    component: () => import('./pages/Home'),
    name: 'Home',
    path: '/',
  },
  {
    component: () => import('./pages/Users'),
    name: 'Users',
    path: '/users',
  },
  {
    component: () => import('./pages/TextEdit'),
    name: 'Texts',
    path: '/text-edit/:textId',
  },
  {
    component: () => import('./pages/LetterView'),
    name: 'View Letter',
    path: '/letters/letter-view/:letterId',
  },
  {
    component: () => import('./pages/LetterView'),
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

const guards: Guard[] = [
  // Authentication guard to redirect to login if not authenticated
  async (_, to) => {
    if (!store.user && to !== 'Login') {
      return '/login';
    } else {
      return;
    }
  },

  // Guard to redirect to home page if already authenticated
  async (_, to) => {
    if (store.user && to === 'Login') {
      return '/';
    } else {
      return;
    }
  },
];

export {
  routes,
  guards,
};