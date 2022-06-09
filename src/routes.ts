import { Route } from "./components/Router/Router";

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
];

export default routes;