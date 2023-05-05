import { Component, useState, xml } from "@odoo/owl";
import useCurrentTranslator from "../../hooks/useCurrentTranslator";
import RouterLink from "../../components/Router/RouterLink";
import MenuButton from "./MenuButton";
import Icon from "../../components/Icon";
import SettingsModal from "../../components/SettingsModal";
import ChildModal from "../../components/ChildModal";
import HelpModal from "../../components/HelpModal";
import { getWebPath } from "../../utils";

class Menu extends Component {
  static template = xml`
    <div t-if="props.router.currentRoute and props.router.currentRoute.route.name !== 'Login'" class="h-screen fixed left-0 top-0 w-20 bg-compassion shadow-2xl z-50 flex flex-col items-center">
      <div class="flex w-20 h-20 items-center justify-center">
        <img t-att-src="webPath('/logo_white.png')" class="w-12" />
      </div>
      <RouterLink to="'/'" t-slot-scope="scope">
        <MenuButton tooltip="'Home'" active="scope.active">
          <Icon prefix="'fas'" icon="'home'" class="'text-xl'" />
        </MenuButton>
      </RouterLink>
      <RouterLink to="'/translators'" t-slot-scope="scope" t-if="currentTranslator.data.role === 'admin'">
        <MenuButton tooltip="'Translators'" active="scope.active">
          <Icon prefix="'fas'" icon="'user-group'" class="'text-xl'" />
        </MenuButton>
      </RouterLink>
      <RouterLink to="'/letters'" t-slot-scope="scope">
        <MenuButton tooltip="'Letters'" active="scope.active">
          <Icon prefix="'fas'" icon="'envelope'" class="'text-xl'" />
        </MenuButton>
      </RouterLink>
      <div class="mt-auto">
        <MenuButton tooltip="'Child Protection'" class="'cursor-pointer child-menu-icon'" t-on-click="() => this.state.childModal = true">
          <Icon prefix="'fas'" icon="'child'" class="'text-xl'" />
        </MenuButton>
        <MenuButton tooltip="'Help'" class="'cursor-pointer'" t-on-click="() => this.state.helpModal = true">
          <Icon prefix="'fas'" icon="'info'" class="'text-xl'" />
        </MenuButton>
        <MenuButton tooltip="'Settings'" class="'cursor-pointer'" t-on-click="() => this.state.settingsModal = true">
          <Icon prefix="'fas'" icon="'cog'" class="'text-xl'" />
        </MenuButton>
      </div>
    </div>
    <ChildModal onClose="() => this.state.childModal = false" active="state.childModal"/>
    <HelpModal onClose="() => this.state.helpModal = false" active="state.helpModal"/>
    <SettingsModal onClose="() => this.state.settingsModal = false" active="state.settingsModal" />
  `;

  static props = ['router'];

  webPath = getWebPath;

  static components = {
    RouterLink,
    SettingsModal,
    ChildModal,
    HelpModal,
    MenuButton,
    Icon,
  };

  state = useState({
    settingsModal: false,
    childModal: false,
    helpModal: false
  });

  currentTranslator = useCurrentTranslator();
}

export default Menu;