import { mount } from "@odoo/owl";
import App from './App';
import translateFn from './i18n';
import './style.css';
import './icons';

mount(App, document.body, {
  translateFn,
  dev: true,
});
