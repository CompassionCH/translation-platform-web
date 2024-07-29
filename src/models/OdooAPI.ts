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
import _ from "../i18n";
import {
  RPC_FAULT_CODE_ACCESS_DENIED,
  RPC_FAULT_CODE_ACCESS_ERROR,
  RPC_FAULT_CODE_APPLICATION_ERROR,
  STORAGE_KEY
} from "../constants";

type AuthTokens = {
  access_token: string;
  refresh_token: string;
  expires_at: string;
}

type ExecuteKwOptions = {
  password?: string;
}

// Declare the two XML-RPC clients
const authClient = new XmlRpcClient(import.meta.env.VITE_ODOO_URL + "/xmlrpc/2/common");
const apiClient = new XmlRpcClient(import.meta.env.VITE_ODOO_URL + "/xmlrpc/2/object");

const setClientHeader = (header: string, value: string) => {
  (authClient.headers as Record<string, string>)[header] = value;
  (apiClient.headers as Record<string, string>)[header] = value;
};

const OdooAPI = {

  /**
   * Attempts to authenticate the user given a username and a
   * password
   * @param username the username
   * @param password the password
   * @returns the authenticated user's information or null if failed authenticating
   */
  async authenticate(username: string, password: string, totp?: string): Promise<boolean> {
    setClientHeader('Authorization', totp ? 'Basic totp=' + totp : 'Basic ');

    const userId = await authClient.methodCall('authenticate', [
      import.meta.env.VITE_ODOO_DBNAME,
      username,
      password,
      [],
    ]) as number | false;
    if (userId === false) {
      return false;
    } else {
      store.userId = userId as number;
      store.username = username;

      try {
        const result = await this.executeWithOptions_kw<AuthTokens>('res.users', 'generate_external_auth_token', {
          password,
        }, [userId]);
        store.accessToken = result?.access_token;
        store.refreshToken = result?.refresh_token;
      }
      catch (e) {
        return false;
      }

      // INFO: next line needed because the store callback is not called every time we update the values
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
      return true;
    }
  },

  ifNoneElse<V, T extends any = undefined>(val: V, other?: T): V | T {
    if ((val as any) === "None") return other as T;
    return val;
  },

  async executeWithOptions_kw<T>(model: string, method: string, options: ExecuteKwOptions, ...args: any[]): Promise<T | undefined> {
    if (store.accessToken && !options.password) {
      setClientHeader('Authorization', 'Bearer ' + store.accessToken);
    }

    console.log(model, method, args)
    
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

      throw e;
    }
  },

  async execute_kw<T>(model: string, method: string, ...args: any[]): Promise<T | undefined> {
    return await this.executeWithOptions_kw(model, method, {}, ...args);
  }
}

export default OdooAPI;