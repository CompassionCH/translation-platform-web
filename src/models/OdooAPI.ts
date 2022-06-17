/**
 * This class should be used to offer a basic abstraction
 * on top of querying Odoo with API/JSON-RPC calls.
 * It should be then used inside the DAOs to fetch resources.
 * 
 * You can use the various authentication informations
 * stored in the store to perform such API calls
 */

import { User, allUsers } from "./UserDAO";

export const EXAMPLE_USER: User = {
  ...allUsers[0],
  username: 'toto',
  password: 'toto',
  userId: '123456789',
};

const OdooAPI = {

  /**
   * Attempts to authenticate the user given a username and a
   * password
   * @param username the username
   * @param password the password
   * @returns the authenticated user's informations or null if failed authenticating
   */
  async authenticate(username: string, password: string): Promise<User | null> {
    return new Promise(resolve => setTimeout(() => {
      if (username === EXAMPLE_USER.username && password === EXAMPLE_USER.password) {
        resolve(EXAMPLE_USER);
      } else {
        resolve(null);
      }
    }, Math.random() * 500 + 500));
  }
}

export default OdooAPI;