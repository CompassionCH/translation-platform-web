import { Component, xml } from "@odoo/owl";
import RouterLink from "../../components/Router/RouterLink";

class LetterRowActions extends Component {

  static template = xml`
    <div class="flex">
      <RouterLink to="'/letter-view/' + props.letter.id">View</RouterLink>
      <RouterLink to="'/letter-edit/' + props.letter.id">Edit</RouterLink>
    </div>
  `;

  static props = {
    letter: { type: Object },
  };

  static components = {
    RouterLink,
  };
}


export default LetterRowActions;