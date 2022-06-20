import { Component, xml } from "@odoo/owl";

import Button from "../../components/Button";
import RouterLink from "../../components/Router/RouterLink";
import { Letter } from "../../models";

type Props = {
  title: string;
  remaining: number;
  letters: Letter[];
  highlight?: boolean;
};

class TranslationCard extends Component<Props> {
  static template = xml`
    <div class="bg-white rounded-sm ring-2 w-72 overflow-hidden flex flex-col" t-att-class="{
      'ring-compassion ring-opacity-70': props.highlight,
      'ring-slate-200 ring-opacity-30': !props.highlight,
    }">
      <div class="bg-slate-100 px-4 py-3">
        <h4 class="font-light text-lg text-slate-700" t-esc="props.title" />
        <p class="text-slate-600 text-xs"><t t-esc="props.remaining" /> Texts remaining</p>
      </div>
      <div class="p-4 bg-white flex-1">
        <div t-if="props.letters.length gt 0">
          <RouterLink to="'/letters/letter-edit/' + props.letters[0].id">
            <Button icon="'star'" color="'compassion'" level="props.highlight ? 'primary' : 'secondary'" class="'w-full mb-2'" size="'sm'">Take the first</Button>
          </RouterLink>
          <RouterLink t-foreach="props.letters" t-as="text" t-key="text.id" to="'/letters/letter-edit/' + text.id">
            <button class="block text-sm text-slate-700 hover:text-compassion hover:translate-x-0.5 transform transition-all mb-1" t-esc="text.title" />
          </RouterLink>
        </div>
        <div t-else="" class="flex h-full items-center justify-center flex-col">
          <p class="text-slate-400 text-center">There's currently no text to translate here</p>
        </div>
      </div>
    </div>
  `;

  static props = {
    title: {
      type: String,
    },
    remaining: {
      type: Number,
    },
    letters: {
      type: Array,
    },
    highlight: {
      type: Boolean,
      optional: true,
    }
  };

  static components = {
    Button,
    RouterLink,
  };
}

export default TranslationCard;