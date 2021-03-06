/**
 * This class should be used to offer a basic abstraction
 * on top of querying Odoo with API/JSON-RPC calls.
 * It should be then used inside the DAOs to fetch resources.
 * 
 * You can use the various authentication informations
 * stored in the store to perform such API calls
 */

import store from "../store";
import { XmlRpcClient } from '@foxglove/xmlrpc';

// Declare the two XML-RPC clients
const authClient = new XmlRpcClient(import.meta.env.VITE_ODOO_URL + "/xmlrpc/2/common");
const apiClient = new XmlRpcClient(import.meta.env.VITE_ODOO_URL + "/xmlrpc/2/object");

const OdooAPI = {

  /**
   * Attempts to authenticate the user given a username and a
   * password
   * @param username the username
   * @param password the password
   * @returns the authenticated user's informations or null if failed authenticating
   */
  async authenticate(username: string, password: string): Promise<boolean> {
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
      store.password = password;
      return true;
    }
  },

  ifNoneElse<V, T extends any = undefined>(val: V, other?: T): V | T {
    if ((val as any) === "None") return other as T;
    return val;
  },

  async execute_kw<T>(model: string, method: string, ...args: any[]): Promise<T | undefined> {
    try {
      const response = await apiClient.methodCall('execute_kw', [
        import.meta.env.VITE_ODOO_DBNAME,
        store.userId,
        store.password,
        model,
        method,
        ...args,
      ]);

      return response as any as T;
    } catch (e) {
      throw e;
      // clearStoreCache();
      // window.location.reload();
    }
  }
}

export default OdooAPI;