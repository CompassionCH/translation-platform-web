/**
 * This class should be used to offer a basic abstraction
 * on top of querying Odoo with API/JSON-RPC calls.
 * It should be then used inside the DAOs to fetch resources.
 * 
 * You can use the various authentication information
 * stored in the store to perform such API calls
 */

import store, { clearStoreCache } from "../store";
import { XmlRpcClient } from '@foxglove/xmlrpc';
import { selectedLang } from "../i18n";
import notyf from "../notifications";
import fetch from "@foxglove/just-fetch";
import _ from "../i18n";
import {
  RPC_FAULT_CODE_ACCESS_DENIED,
  RPC_FAULT_CODE_ACCESS_ERROR,
  STORAGE_KEY,
  STORE_VERSION
} from "../constants";

type AuthResponse = {
  user_id: number;
  auth_tokens: AuthTokens;
}

type AuthTokens = {
  access_token: string;
  refresh_token: string;
  expires_at: string;
};

type ExecuteKwOptions = {
  password?: string;
  refreshIfExpired?: boolean;
}

// Declare the XML-RPC client
const apiClient = new XmlRpcClient(import.meta.env.VITE_ODOO_URL + "/xmlrpc/2/object");

const setClientHeader = (header: string, value: string) => {
  (apiClient.headers as Record<string, string>)[header] = value;
};


async function fetchJson(uri: string, body: any, verb = 'POST'): Promise<any> {
  const res = await fetch(import.meta.env.VITE_ODOO_URL + uri, {
    method: verb,
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json", Accept: "application/json" }
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

  const payload = await res.json();
  if (payload.error) throw payload.error.data;

  return payload.result;
}

async function refreshAccessToken(): Promise<AuthTokens> {
  return {
    access_token: store.accessToken!,
    refresh_token: store.refreshToken!,
    expires_at: store.accessTokenExpiresAt!
  };
}

const OdooAPI = {
  async authenticate(username: string, password: string): Promise<true | any> {
    try {
      const commonClient = new XmlRpcClient(import.meta.env.VITE_ODOO_URL + "/xmlrpc/2/common");
      const uid = await commonClient.methodCall('authenticate', [
        import.meta.env.VITE_ODOO_DBNAME,
        username,
        password,
        {}
      ]);

      if (!uid) throw new Error("user invalid");

      const authTokens: AuthTokens = {
        access_token: password,
        refresh_token: "native-xmlrpc",
        expires_at: "2099-01-01T00:00:00.000Z"
      };

      Object.assign(store, {
        version: STORE_VERSION,
        userId: Number(uid),
        username,
        accessToken: authTokens.access_token,
        refreshToken: authTokens.refresh_token,
        accessTokenExpiresAt: authTokens.expires_at
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));

      return true;
    } catch (e: any) {
      console.warn("Failed to authenticate: ", e);
      return e;
    }
  },

  ifNoneElse<V, T extends any = undefined>(val: V, other?: T): V | T {
    if ((val as any) === "None") return other as T;
    return val;
  },

  async logout(): Promise<void> {
    console.log("Logout bypassed for development mode");
    clearStoreCache();
    return Promise.resolve();
  },

  async executeWithOptions_kw<T>(model: string, method: string, options: ExecuteKwOptions, ...args: any[]): Promise<T | undefined> {
    if (!store.accessToken && !options.password) {
      console.warn("Tried to execute a request without credentials.");
      return;
    }
    const refreshMarginMs = 10_000;
    if (store.accessToken && options.refreshIfExpired !== false &&
        new Date(store.accessTokenExpiresAt!).getTime() < Date.now() + refreshMarginMs) {
      try { await refreshAccessToken(); } catch { clearStoreCache(); return; }
    }

    setClientHeader('Authorization', 'Bearer ' + store.accessToken);

    try {
      args.push({ context: { lang: selectedLang } });
      const response = await apiClient.methodCall('execute_kw', [
        import.meta.env.VITE_ODOO_DBNAME,
        store.userId,
        options.password ?? store.accessToken,
        model,
        method,
        ...args
      ]);

      return response as any as T;
    } catch (e: any) {
      if ([RPC_FAULT_CODE_ACCESS_ERROR, RPC_FAULT_CODE_ACCESS_DENIED].includes(e.code)) {
        console.warn("Access denied ignored in dev mode.", e);
        clearStoreCache();


      } else {
        notyf.error(_('Oops! An error occurred. Please contact Compassion for further assistance.'));
      }

      return;
    }
  },

  async execute_kw<T>(model: string, method: string, ...args: any[]): Promise<T | undefined> {
    return await this.executeWithOptions_kw(model, method, {}, ...args);
  }
};

export default OdooAPI;