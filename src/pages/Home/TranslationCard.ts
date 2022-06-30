import { Component, xml } from "@odoo/owl";

import Button from "../../components/Button";
import RouterLink from "../../components/Router/RouterLink";
import Helper from "../../components/Helper";
import _ from "../../i18n";
import { Letter } from "../../models";

type Props = {
  title: string;
  remaining: number;
  letters: Letter[];
  status?: 'highlight' | 'unverified';
};

class TranslationCard extends Component<Props> {
  static template = xml`
    <div class="bg-white rounded-sm ring-2 w-72 overflow-hidden flex flex-col" t-att-class="{
      'ring-compassion ring-opacity-70': props.status === 'highlight',
      'ring-yellow-300 ring-opacity-80': props.status === 'unverified',
      'ring-slate-200 ring-opacity-30': props.status === undefined,
    }">
      <div class="bg-slate-100 px-4 py-3 flex justify-between">
        <div>
          <h4 class="font-light text-lg text-slate-700" t-esc="props.title" />
          <p t-if="props.status !== 'unverified'" class="text-slate-600 text-xs"><t t-esc="props.remaining" /> Texts remaining</p>
          <p t-else="" class="text-slate-600 text-xs">Waiting for validation</p>
        </div>
        <div>
          <Helper t-if="props.status === 'highlight'" content="_('These letters are your saved work in progress waiting to be submitted')" />
          <Helper t-if="props.status === 'unverified'" content="_('This translation skill is currently waiting to be validated, please translate the given letter for it to be reviewed')" />
        </div>
      </div>
      <div class="p-4 bg-white flex-1">
        <div t-if="props.letters.length gt 0 and props.status !== 'unverified'">
          <RouterLink to="'/letters/letter-edit/' + props.letters[0].id">
            <Button icon="'star'" color="'compassion'" level="props.status === 'highlight' ? 'primary' : 'secondary'" class="'w-full mb-2'" size="'sm'">Take the first</Button>
          </RouterLink>

          <!-- letters -list -->
          <RouterLink t-foreach="props.letters" t-as="text" t-key="text.id" to="'/letters/letter-edit/' + text.id">
            <button class="block text-sm text-slate-700 hover:text-compassion hover:translate-x-0.5 transform transition-all mb-1">
              <span class="font-semibold" t-esc="text.id" />
              <span class="pl-2" t-esc="'(' + _(text.source) + ' -> ' + _(text.target) + ')'" />
            </button>
          </RouterLink>
        </div>
        <div t-elif="props.status !== 'unverified'">
          <RouterLink t-if="props.letters.length gt 0" to="'/letters/letter-edit/' + props.letters[0].id">
            <Button icon="'star'" color="'compassion'" level="props.highlight ? 'primary' : 'secondary'" class="'w-full mb-2'" size="'sm'">Translate Verification Letter</Button>
          </RouterLink>
          <p t-else="" class="px-3 py-1.5 bg-yellow-50 border border-solid border-yellow-200 text-sm text-center text-yellow-700 mb-1">There are currently no letters</p>
          <p class="text-center text-slate-600 text-sm">This skill must be validated, to do so you must first translate a letter which will be double checked at Compassion</p>
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
    status: {
      type: String,
      optional: true,
    }
  };

  static components = {
    Button,
    RouterLink,
    Helper,
  };

  _ = _;
}

export default TranslationCard;