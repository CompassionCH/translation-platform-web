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
            <span class="relative">
              <input t-ref="password" class="compassion-input text-sm mb-3 !pr-[30px]" t-att-type="state.showPassword ? 'text' : 'password'" placeholder="Password" t-model="state.password" />
              <button t-on-click="togglePassword" type="button" tabindex="-1">
                <svg class="shrink-0 size-3.5 absolute right-2 top-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#778" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <g t-if="state.showPassword">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </g>
                  <g t-else="">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                    <line x1="2" x2="22" y1="2" y2="22" />
                  </g>
                </svg>
              </button>
            </span>
            <input t-if="state.use2FA" class="compassion-input text-sm mb-3" type="text" inputmode="numeric" pattern="[0-9]*" placeholder="6-digits 2FA code" t-model="state.totp" />
            <Button color="'compassion'" class="'w-full mb-2'" size="'sm'">Login</Button>
            <div class="flex justify-between mt-2">
              <div class="flex justify-left items-center">
                <input id="2fa-checkbox" t-model="state.use2FA" type="checkbox" value="" class="w-4 h-4 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"/>
                <label for="2fa-checkbox" class="ms-2 ml-2 text-sm select-none font-medium text-compassion">Use 2FA</label>
              </div>
              <a href="#" class="text-sm font-medium text-compassion hover:text-slate-900 transition-colors" t-on-click="() => state.settingsModal = true">Switch language</a>
            </div>
          </form>
        </div>
        <img t-att-src="webPath('/splash.jpg')" class="object-cover w-128 shadow-inner hidden md:block" />
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
    totp: '',
    loading: false,
    settingsModal: false,
    use2FA: false,
  });

  static components = {
    Button,
    Loader,
    Transition,
    SettingsModal,
  };

  async login() {
    this.state.loading = true;
    const { username, password, totp } = this.state;
    const res = await OdooAPI.authenticate(username, password, totp)
    if (res !== true) {
      if (res.endsWith('InvalidTotp') && this.state.use2FA === false) {
        this.state.use2FA = true;
        notyf.error(_('This account requires 2FA'));
      }
      else {
        notyf.error(_('Failed to log in, incorrect credentials'));
      }
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