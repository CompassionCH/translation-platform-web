/**
 * Application entry point
 * Imports and mounts Owl with the Layout component, include
 * styles and loads icons
 */
import { mount } from "@odoo/owl";
import { Buffer } from "buffer";
import Layout from "./pages/Layout";
import translateFn from "./i18n";
import "./style.css";
import "./icons";

// Buffer Polyfill used by the xml-rpc library
window.Buffer = Buffer;
globalThis.Buffer = Buffer;

mount(Layout, document.body, {
  translateFn,
  dev: import.meta.env.DEV,
});
