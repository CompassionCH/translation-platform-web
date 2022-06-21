/**
 * This class should be used to offer a basic abstraction
 * on top of querying Odoo with API/JSON-RPC calls.
 * It should be then used inside the DAOs to fetch resources.
 * 
 * You can use the various authentication informations
 * stored in the store to perform such API calls
 */

import store from "../store";
import { allUsers, User } from "./UserDAO";

const OdooAPI = {

  /**
   * Attempts to authenticate the user given a username and a
   * password
   * @param username the username
   * @param password the password
   * @returns the authenticated user's informations or null if failed authenticating
   */
  async authenticate(username: string, password: string): Promise<string | null> {
    return new Promise(resolve => setTimeout(() => {
      if (username === 'toto' && password === 'toto') {
        // Set store authentication data
        store.userId = '123456789';
        store.password = 'toto';
        resolve(allUsers[0].username);
      } else {
        resolve(null);
      }
    }, Math.random() * 500 + 500));
  }
}

export default OdooAPI;