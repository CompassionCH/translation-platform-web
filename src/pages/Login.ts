import { Component, useState, xml } from "@odoo/owl";
import Button from "../components/Button";
import OdooAPI from "../models/OdooAPI";
import notyf from "../notifications";
import store from "../store";
import Transition from "../components/Transition";
import Loader from "../components/Loader";
import useCurrentTranslator from "../hooks/useCurrentTranslator";
import SettingsModal from "../components/SettingsModal";
import _ from "../i18n";
import { getWebPath } from "../utils";

class Login extends Component {

  static template = xml`
    <SettingsModal active="state.settingsModal" onClose="() => state.settingsModal = false" />
    <div class="w-full h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
      <div class="flex shadow-xl relative rounded-sm overflow-hidden">
        <div class="h-full bg-white py-20 w-80 px-10">
          <img t-att-src="webPath('/logo_simple.png')" class="block mx-auto w-16 mb-3" />
          <h3 class="text-center text-slate-600 h-6">Compassion</h3>
          <h1 class="text-center text-slate-800 font-light text-2xl mb-5">Translation Platform</h1>
          <form t-on-submit.prevent="login">
            <input class="compassion-input text-sm mb-3" type="text" placeholder="E-mail" t-model="state.username" />
            <input class="compassion-input text-sm mb-3" type="password" placeholder="Password" t-model="state.password" />
            <Button color="'compassion'" class="'w-full mb-2'" size="'sm'">Login</Button>
            <div class="flex justify-between mt-2">
              <a href="#" class="text-sm font-medium text-compassion hover:text-slate-900 transition-colors" t-on-click="() => state.settingsModal = true">Switch language</a>
            </div>
          </form>
        </div>
        <img t-att-src="webPath('/splash.jpg')" class="object-cover w-128 shadow-inner" />
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

  user = useCurrentTranslator();

  webPath = getWebPath;

  state = useState({
    username: '',
    password: '',
    loading: false,
    settingsModal: false,
  });

  static components = {
    Button,
    Loader,
    Transition,
    SettingsModal,
  };

  async login() {
    this.state.loading = true;
    const { username, password } = this.state;
    const res = await OdooAPI.authenticate(username, password)
    if (!res) {
      notyf.error(_('Failed to log in, incorrect credentials'));
      this.state.loading = false;
    } else {
      // Provide user to all next components, better UI, minimize number of loaders

      try {  // INFO: finally needed to set loading = false, otherwise the user has to refresh the page to try logging in again
        await this.user.refresh();

        // Set username in store
        store.username = username;
        location.reload();
      } finally {
        this.state.loading = false;
      }
    }
  }
}

export default Login;