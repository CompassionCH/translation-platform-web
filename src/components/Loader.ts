import { Component, xml } from "@odoo/owl";
import { PropsType } from "../UtilityTypes";
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

export default Loader;