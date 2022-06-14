import store from "../store";

/**
 * This class should be used to offer a basic abstraction
 * on top of querying Odoo with API/JSON-RPC calls.
 * It should be then used inside the DAOs to fetch resources.
 * 
 * You can use the various authentication informations
 * stored in the store to perform such API calls
 */
const OdooAPI = {

  async authenticate() {
    const { username, password } = store;
    return new Promise(resolve => setTimeout(() => {
      if (username === 'toto' && password === 'toto') {
        store.userId = '123456789';
        resolve(true);
      } else {
        resolve(false);
      }
    }, Math.random() * 500 + 500));
  }
}

export default OdooAPI;