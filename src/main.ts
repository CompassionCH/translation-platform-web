import { mount } from "@odoo/owl";
import Layout from "./layout";
import translateFn from './i18n';
import './style.css';

mount(Layout, document.body, {
  translateFn,
});