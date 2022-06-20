import { Component, xml } from "@odoo/owl";
import { PropsType } from "../UtilityTypes";
import Transition from "./Transition";
import Icon from "./Icon";

const props = {
  class: { type: String, optional: true },
  '*': {}
};

class Loader extends Component<PropsType<typeof props>> {

  static template = xml`
    <div class="flex flex-col">
      <div class="flex justify-center">
        <div class="animate-spin text-compassion" t-att-class="props.class">
          <Icon icon="'circle-notch'" />
        </div>
      </div>
      <t t-slot="default" />
    </div>
  `;

  static props = props;

  static components = {
    Icon,
  };
}

class BlurLoader extends Component {
  static template = xml`
    <Transition active="props.active" t-slot-scope="scope">
      <div class="z-40 top-0 left-0 w-full h-full bg-white-20 backdrop-blur-sm flex items-center justify-center" t-att-class="scope.itemClass + ' ' + (props.fixed ? 'fixed' : 'absolute')">
        <div class="p-8 bg-white rounded-sm shadow-2xl">
          <Loader class="'text-3xl'" />
        </div>
      </div>
    </Transition>
  `;

  static components = {
    Transition,
    Loader,
  };

  static props = {
    fixed: { type: Boolean, optional: true },
    active: { type: Boolean, optional: true },
  };
}

export {
  BlurLoader,
};

export default Loader;