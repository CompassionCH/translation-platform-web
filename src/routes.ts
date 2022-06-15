import { Guard, Route } from "./components/Router/Router";
import store from "./store";

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
    component: () => import('./pages/Letters'),
    name: 'Letters',
    path: '/letters',
  },
  {
    component: () => import('./pages/LetterView'),
    name: 'View Letter',
    path: '/letter-view/:letterId',
  },
  {
    component: () => import('./pages/LetterView'),
    name: 'Edit Letter',
    path: '/letter-edit/:letterId',
  },
  {
    component: () => import('./pages/Login'),
    name: 'Login',
    path: '/login',
  }
];

const guards: Guard[] = [
  // Authentication guard
  async (_, to) => {
    if (!store.user && to !== 'Login') {
      return '/login';
    } else {
      return;
    }
  },
];

export {
  routes,
  guards,
};