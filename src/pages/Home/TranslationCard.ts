import { Component, xml } from "@odoo/owl";

import Button from "../../components/Button";

type Props = {
  title: string;
  remaining: number;
  texts: Array<{ title: string, id: number }>;
};

class TranslationCard extends Component<Props> {
  static template = xml`
    <div class="bg-white shadow-lg rounded-sm overflow-hidden w-72">
      <div class="bg-slate-100 border-b border-solid border-slate-300 px-4 py-3">
        <h4 class="font-light text-lg text-slate-700" t-esc="props.title" />
        <p class="text-slate-600 text-xs"><t t-esc="props.remaining" /> Texts remaining</p>
      </div>
      <div class="p-4 bg-white">
        <div t-if="props.texts.length gt 0">
          <Button icon="'star'" color="'compassion'" level="'secondary'" class="'w-full mb-2'" size="'sm'">Take the first</Button>
          <t t-foreach="props.texts" t-as="text" t-key="text.id">
            <a href="#" class="block text-sm text-slate-700 hover:text-compassion hover:translate-x-0.5 transform transition-all mb-1" t-esc="text.title" />
          </t>
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
    texts: {
      type: Array,
    }
  };

  static components = {
    Button,
  };
}

export default TranslationCard;