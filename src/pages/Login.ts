import { Component, useState, xml } from "@odoo/owl";
import Button from "../components/Button";
import OdooAPI from "../models/OdooAPI";
import notyf from "../notifications";
import store from "../store";
import Transition from "../components/Transition";
import Loader from "../components/Loader";

class Login extends Component {

  static template = xml`
    <div class="w-full h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
      <div class="flex shadow-xl relative rounded-sm overflow-hidden">
        <div class="h-full bg-white py-20 w-80 px-10">
          <img src="/logo_simple.png" class="block mx-auto w-16 mb-3" />
          <h3 class="text-center text-slate-600 h-6">Compassion</h3>
          <h1 class="text-center text-slate-800 font-light text-2xl mb-5">Translation Platform</h1>
          <form t-on-submit.prevent="login">
            <input class="compassion-input text-sm mb-3" type="text" placeholder="Username" t-model="state.username" />
            <input class="compassion-input text-sm mb-3" type="password" placeholder="Password" t-model="state.password" />
            <Button color="'compassion'" class="'w-full mb-2'" size="'sm'">Login</Button>
            <div class="flex justify-center">
              <a href="#" class="text-xs text-slate-500 hover:text-slate-800 transition-colors">Forgot my password</a>
            </div>
          </form>
        </div>
        <img src="/splash.jpg" class="object-cover w-128 shadow-inner" />
        <Transition active="state.loading" t-slot-scope="scope">
          <div class="absolute top-0 left-0 bg-white-20 w-full h-full flex items-center justify-center" t-att-class="scope.itemClass">
            <div class="bg-white p-10 shadow-2xl rounded-sm">
              <Loader class="'text-3xl'" />
            </div>
          </div>
        </Transition>
      </div>
    </div>
  `;

  state = useState({
    username: '',
    password: '',
    loading: false,
  });

  static components = {
    Button,
    Loader,
    Transition,
  };

  login() {
    this.state.loading = true;
    const { username, password } = this.state;
    OdooAPI.authenticate(username, password).then((res) => {
      this.state.loading = false;
      if (!res) {
        notyf.error('Failed to log in, incorrect credentials');
      } else {
        // Go to home page
        store.user = res;
        window.history.pushState({}, "", '/');
      }
    });
  }
}

export default Login;