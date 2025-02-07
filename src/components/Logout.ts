import { Component, xml } from "@odoo/owl";
import Loader from "./Loader";
import { clearStoreCache } from "../store";
import OdooAPI from "../models/OdooAPI";

class Logout extends Component {

    setup() {
        this.logout()
    }

    async logout() {
        // First, we attempt to revoke the token on the backend.
        try {
          await OdooAPI.logout();
        } catch (error){
            console.warn("Failed to logout: " + error);
        }
        // Clear session storage and reload page
        clearStoreCache();
        window.location.reload();
    }

  static template = xml`
    <Loader/>
  `;

  static components = {
    Loader,
  };
}

export default Logout;