import { Component, xml } from "@odoo/owl";
import Tippy from "./Tippy";
import Icon from "./Icon";

class Helper extends Component {
  static template = xml`
    <Tippy content="props.content">
      <Icon icon="'circle-question'" class="props.class || 'text-slate-400'" />
    </Tippy>
  `;

  static props = {
    class: { type: String, optional: true },
    content: { type: String },
  }

  static components = {
    Tippy,
    Icon,
  }
}

export default Helper;