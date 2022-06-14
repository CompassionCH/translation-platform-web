import { Component, xml } from "@odoo/owl";
import RouterLink from "../../components/Router/RouterLink";

class LetterRowActions extends Component {

  static template = xml`
    <div class="flex">
      <RouterLink to="'/translation-view/' + props.translation.id">View</RouterLink>
      <RouterLink to="'/translation-edit/' + props.translation.id">Edit</RouterLink>
    </div>
  `;

  static props = {
    translation: { type: Object },
  };

  static components = {
    RouterLink,
  };
}


export default LetterRowActions;