import { Component, xml } from "@odoo/owl";
import RouterLink from "../../components/Router/RouterLink";

class LetterRowActions extends Component {

  static template = xml`
    <div class="flex gap-1">
      <RouterLink to="'/letters/letter-view/' + props.letter.id">
        <button class="text-blue-500 hover:text-compassion transition-colors">View</button>
      </RouterLink>
      <span class="text-slate-600">·</span>
      <RouterLink to="'/letters/letter-edit/' + props.letter.id">
        <button class="text-blue-500 hover:text-compassion transition-colors">Edit</button>
      </RouterLink>
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