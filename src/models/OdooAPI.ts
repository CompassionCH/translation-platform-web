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
  RPC_FAULT_CODE_APPLICATION_ERROR,
  STORAGE_KEY
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
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      // TODO: pass language to get localized error.
      // "Accept-Language": selectedLang,
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to refresh. Returned ${res.status}: "${res.statusText}"`)
  }

  const payload = JSON.parse(await res.text());
  if (payload.error) {
    throw payload.error.data;
  }

  return payload.result;
}

// Buffered token refresh.
const refreshListeners: ((tokens?: AuthTokens, err?: any) => void)[] = [];
function refreshAccessToken(): Promise<AuthTokens> {
  const operationCompleted =
    (tokens?: AuthTokens, err?: any) => {
      refreshListeners.forEach(l => l(tokens, err));
      refreshListeners.length = 0;
    };

  return new Promise(async (res, rej) => {
    refreshListeners.push((tokens, err) => tokens ? res(tokens) : rej(err));

    // A refresh request is pending, wait for it and do nothing.
    if (refreshListeners.length !== 1) {
      return;
    }

    let authTokens: AuthTokens | null = null;
    try {
      authTokens = await fetchJson('/auth/refresh', {
        refresh_token: store.refreshToken,
      });
    }
    catch (e) {
      operationCompleted(undefined, e);
      return;
    }

    store.accessToken = authTokens?.access_token;
    store.accessTokenExpiresAt = authTokens?.expires_at;
    store.refreshToken = authTokens?.refresh_token;

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));

    operationCompleted(authTokens!);
  })
}


const OdooAPI = {

  /**
   * Attempts to authenticate the user given a username, a password, and optionally
   * a totp.
   * @param username the username
   * @param password the password
   * @returns True if the credentials are valid or the server error.
   */
  async authenticate(username: string, password: string, totp?: string): Promise<true | any> {
    try {
      const { user_id, auth_tokens }: AuthResponse = await fetchJson('/auth/login', {
        username,
        password,
        totp,
      });

      store.userId = user_id;
      store.username = username;
      store.accessToken = auth_tokens.access_token;
      store.refreshToken = auth_tokens.refresh_token;
      store.accessTokenExpiresAt = auth_tokens.expires_at;

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));

      return true;
    }
    catch (e: any) {
      console.warn("Failed to authenticate: ", e);
      return e;
    }
  },

  ifNoneElse<V, T extends any = undefined>(val: V, other?: T): V | T {
    if ((val as any) === "None") return other as T;
    return val;
  },

  async executeWithOptions_kw<T>(model: string, method: string, options: ExecuteKwOptions, ...args: any[]): Promise<T | undefined> {
    if (store.accessToken && !options.password) {
      const refreshWindowMs = 5 * 60 * 1000;
      if (options.refreshIfExpired !== false && (new Date(store.accessTokenExpiresAt ?? '').getTime()) < Date.now() + refreshWindowMs) {
        try {
          await refreshAccessToken();
        }
        catch (e) {
          clearStoreCache();
          throw e;
        }
      }

      setClientHeader('Authorization', 'Bearer ' + store.accessToken);
    }
    else if (!options.password) {
      // No token or password. Request will fail.
      console.warn("Tried to execute a request without credentials.")
      return;
    }

    try {
      args.push({ context: { lang: selectedLang } });
      const response = await apiClient.methodCall('execute_kw', [
        import.meta.env.VITE_ODOO_DBNAME,
        store.userId,
        options.password ?? 'None',
        model,
        method,
        ...args,
      ]);

      return response as any as T;
    } catch (e: any) {

      if (
        e.code === RPC_FAULT_CODE_ACCESS_ERROR ||
        e.code === RPC_FAULT_CODE_ACCESS_DENIED ||
        e.code === RPC_FAULT_CODE_APPLICATION_ERROR
      ) {
        notyf.error(_('Oops! There is an issue with your account. Please contact Compassion for further assistance.'));

        // Reset cache when the error is related to a user login issue
        clearStoreCache();


      } else {
        notyf.error(_('Oops! An error occurred. Please contact Compassion for further assistance.'));
      }
    }
  },

  async execute_kw<T>(model: string, method: string, ...args: any[]): Promise<T | undefined> {
    return await this.executeWithOptions_kw(model, method, {}, ...args);
  },
}

export default OdooAPI;