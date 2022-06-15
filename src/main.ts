import { mount } from "@odoo/owl";
import Layout from './pages/Layout';
import translateFn from './i18n';
import './style.css';
import './icons';

mount(Layout, document.body, {
  translateFn,
  dev: true,
});
