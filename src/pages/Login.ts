import { Component, useState, xml } from "@odoo/owl";
import Button from "../components/Button";
import store from "../store";

class Login extends Component {

  static template = xml`
    <div class="w-full h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
      <div class="flex shadow-xl">
        <div class="h-full bg-white py-20 w-80 px-10">
          <img src="/logo_simple.png" class="block mx-auto w-16 mb-3" />
          <h3 class="text-center text-slate-600 h-6">Compassion</h3>
          <h1 class="text-center text-slate-800 font-light text-2xl mb-5">Translation Platform</h1>
          <form t-on-submit.prevent="login">
            <input class="compassion-input mb-3" type="text" placeholder="Username" t-model="state.username" />
            <input class="compassion-input mb-5" type="password" placeholder="Password" t-model="state.password" />
            <Button color="'compassion'" class="'w-full mb-2'" size="'sm'">Login</Button>
            <div class="flex justify-center">
              <a href="#" class="text-xs text-slate-500 hover:text-slate-800 transition-colors">Forgot my password</a>
            </div>
          </form>
        </div>
        <img src="/splash.jpg" class="object-cover w-128 shadow-inner" />
      </div>
    </div>
  `;

  state = useState({
    username: '',
    password: '',
  });

  static components = {
    Button,
  };

  login() {
    store.username = this.state.username;
    store.password = this.state.password;
  }
}

export default Login;