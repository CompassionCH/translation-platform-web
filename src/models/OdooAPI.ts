/**
 * This class should be used to offer a basic abstraction
 * on top of querying Odoo with API/JSON-RPC calls.
 * It should be then used inside the DAOs to fetch resources.
 * 
 * You can use the various authentication informations
 * stored in the store to perform such API calls
 */

import store from "../store";

const OdooAPI = {

  /**
   * Attempts to authenticate the user given a username and a
   * password
   * @param username the username
   * @param password the password
   * @returns the authenticated user's informations or null if failed authenticating
   */
  async authenticate(username: string, password: string): Promise<boolean> {

    return new Promise(resolve => setTimeout(() => {
      if (username === 'toto' && password === 'toto') {
        // Set store authentication data
        store.userId = 123456789;
        store.password = 'toto';
        resolve(true);
      } else {
        resolve(false);
      }
    }, Math.random() * 500 + 500));

    /*
    // Build an XML-RPC client specific for authentication
    const client = new XmlRpcClient(import.meta.env.VITE_ODOO_URL + "/xmlrpc/2/common");
    const userId = await client.methodCall('authenticate', [
      import.meta.env.VITE_ODOO_DBNAME,
      username,
      password,
      [],
    ]) as number | false;

    if (userId === false) {
      return false;
    } else {
      store.userId = userId as number;
      store.password = password;
      return true;
    }
    */
  }
}

export default OdooAPI;