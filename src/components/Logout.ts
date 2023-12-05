import { Component, xml } from "@odoo/owl";
import Loader from "./Loader";
import { clearStoreCache } from "../store";

class Logout extends Component {

    setup() {
        this.logout()
    }

    logout() {
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