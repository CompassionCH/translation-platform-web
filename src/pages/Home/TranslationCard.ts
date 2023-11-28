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
  status?: string | null;
};

class TranslationCard extends Component<Props> {
  static template = xml`
    <div class="bg-white rounded-sm ring-2 w-72 overflow-hidden flex flex-col" t-att-class="{
      'ring-compassion ring-opacity-70': props.status === 'highlight',
      'ring-yellow-300 ring-opacity-80': props.status === 'unverified',
      'ring-indigo-300 ring-opacity-80': props.status === 'waiting',
      'ring-slate-200 ring-opacity-30': props.status === undefined,
    }">
      <div class="bg-slate-100 px-4 py-3 flex justify-between">
        <div>
          <h4 class="font-light text-lg text-slate-700" t-esc="props.title" />
          <p t-if="!props.status || props.status === 'highlight'" class="text-slate-600 text-xs"><t t-esc="props.remaining" /> Letters</p>
          <p t-elif="props.status == 'waiting'" class="text-slate-600 text-xs">Awaiting approval</p>
          <p t-else="" class="text-slate-600 text-xs">Waiting for your verification letter</p>
        </div>
        <div>
          <Helper t-if="props.status === 'highlight'" content="_('These letters are your saved work in progress waiting to be submitted')" />
          <Helper t-if="props.status === 'unverified'" content="_('This translation skill is currently waiting to be validated, please translate the given letter for it to be reviewed')" />
        </div>
      </div>
      <div class="p-4 bg-white flex-1">
        <div t-if="props.letters.length === 0">
          <p class="text-slate-400 text-center">There's currently no letters to translate here</p>
        </div>
        <t t-else="">
          <div t-if="!props.status || props.status == 'highlight'">
            <RouterLink to="'/letters/letter-edit/' + props.letters[0].id">
              <Button icon="'star'" color="'compassion'" level="props.status === 'highlight' ? 'primary' : 'secondary'" class="'w-full mb-2'" size="'sm'">Take the first</Button>
            </RouterLink>
            <RouterLink t-foreach="props.letters" t-as="text" t-key="text.id" to="'/letters/letter-edit/' + text.id">
              <button class="block text-sm hover:text-compassion hover:translate-x-0.5 transform transition-all mb-1" t-att-class="{
                'text-slate-700': !text.translationIssue,
                'text-red-700': text.translationIssue
              }">
                <span class="font-semibold" t-esc="text.child.ref" />
                <span class="pl-2" t-out="'(' + text.date.toLocaleDateString() + ')'" />
              </button>
            </RouterLink>
          </div>
          <div t-elif="props.status == 'waiting'">
            <p class="text-center text-slate-600 text-sm">Your verification letter is awaiting approval. Once approved by our staff, you will be able to start translating in this skill</p>
          </div>
          <div t-else="">
            <RouterLink t-if="props.letters.length gt 0" to="'/letters/letter-edit/' + props.letters[0].id">
              <Button icon="'star'" color="'compassion'" level="props.highlight ? 'primary' : 'secondary'" class="'w-full mb-2'" size="'sm'">Translate Verification Letter</Button>
            </RouterLink>
            <p class="text-center text-slate-600 text-sm">This skill must be validated, to do so you must first translate a letter which will be double checked at Compassion</p>
          </div>
        </t>
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