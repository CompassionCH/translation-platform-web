import { Component, xml } from "@odoo/owl";
import RouterLink from "../../components/Router/RouterLink";
import useCurrentTranslator from "../../hooks/useCurrentTranslator";

class LetterRowActions extends Component {

  static template = xml`
    <div class="flex gap-1 pl-3">
      <t t-if="currentTranslator.data?.role === 'admin'">
        <RouterLink to="'/letters/letter-view/' + props.letter.id">
          <button class="text-blue-500 hover:text-compassion transition-colors">View</button>
        </RouterLink>
        <span class="text-slate-600">·</span>
      </t>
      <RouterLink to="'/letters/letter-edit/' + props.letter.id">
        <button class="text-blue-500 hover:text-compassion transition-colors">Translate</button>
      </RouterLink>
    </div>
  `;

  currentTranslator = useCurrentTranslator();

  static props = {
    letter: { type: Object },
  };

  static components = {
    RouterLink,
  };
}


export default LetterRowActions;