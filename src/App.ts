import { Component, onMounted, useState, xml } from "@odoo/owl";
import store, { watchStore } from "./store";
import Transition from "./components/Transition";
import OdooAPI from "./models/OdooAPI";
import Loader from "./components/Loader";
import Login from './pages/Login';
import Layout from './pages/Layout';
import notyf from "./notifications";

class App extends Component {

  static template = xml`
    <Login t-if="!state.logged" />
    <Layout t-else="" />
    <Transition active="state.loading" t-slot-scope="scope">
      <div class="fixed top-0 left-0 bg-white-40 w-full h-full flex items-center justify-center" t-att-class="scope.itemClass">
        <div class="bg-white p-10 shadow-xl">
          <Loader class="'text-3xl'" />
        </div>
      </div>
    </Transition>
  `;

  static components = {
    Login,
    Layout,
    Transition,
    Loader,
  };

  state = useState({
    logged: false,
    loading: false,
  });

  setup() {
    this.checkAuthentication();
    onMounted(() => {
      watchStore(() => this.checkAuthentication());
    });
  }

  checkAuthentication() {
    // Check authentication with Odoo
    if (this.state.loading) return;
    const { username, password } = store;
    const isEmpty = (str?: string) => str === undefined || str.trim() === '';
    if (isEmpty(username) || isEmpty(password)) return;

    this.state.loading = true;
    OdooAPI.authenticate().then((res) => {
      if (res) {
        this.state.logged = true;
      } else {
        this.state.logged = false;
        notyf.error('Failed logging in, credentials might be wrong');
      }
      this.state.loading = false;
    });
  }
};

export default App;