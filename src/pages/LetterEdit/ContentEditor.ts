import { Component, onWillStart, useState, xml } from "@odoo/owl";
import { Element, Letter } from "../../models/LetterDAO";
import Button from '../../components/Button';

type State = {
  elements: Element[];
  hovered?: string | number;
};

type Props = {
  letter: Letter;
  contentRetriever: (callback: (() => Element[])) => void;
};

const props = {
  letter: { type: Object },
  onChange: { type: Function, optional: true },
  contentRetriever: { type: Function },
};

/**
 * This component offers a visual editor to translate a letter. It
 * is responsible for displaying the various paragraphs and pageBreaks the user
 * can edit.
 */
class ContentEditor extends Component<Props> {

  static template = xml`
    <div>
      <div t-foreach="state.elements" t-as="element" t-key="element.id" class="mx-4 mb-4 border border-solid transition-all" t-att-class="{
        'border-compassion ring ring-2 ring-compassion ring-opacity-30 ring-offset-0': state.hovered === element.id,
        'border-transparent': state.hovered !== element.id,
      }">
        <div t-if="element.type == 'pageBreak'" class="flex">
            <div class="relative bg-slash flex-1 flex justify-center items-center">
              <span class="text-slate-500 font-medium text-xs">Page Break</span>
            </div>
          <div class="flex flex-col justify-center gap-2 ml-2">
            <div t-on-mouseenter="() => state.hovered = element.id" t-on-mouseleave="() => state.hovered = undefined">
              <Button square="true" color="'red'" level="'secondary'" icon="'trash'" onClick="() => this.remove(element.id)" />
            </div>
          </div>
        </div>
        <div t-if="element.type == 'paragraph'" class="flex">
          <div class="bg-white shadow-xl relative z-10 grid grid-cols-6 flex-1">
            <div class="col-span-4 py-4 px-4">
              <h4 class="font-medium text-slate-700 mb-2">Translated Content</h4>
              <textarea class="compassion-input w-full h-32 text-xs" t-model="element.content" />
            </div>
            <div class="col-span-2 bg-slate-50 p-4">
              <h4 class="font-medium text-slate-700 mb-2">Comment</h4>
              <textarea class="compassion-input w-full h-32 text-xs" t-model="element.comments" />
            </div>
          </div>
          <div class="flex flex-col justify-center gap-2 ml-2">
            <div t-on-mouseenter="() => state.hovered = element.id" t-on-mouseleave="() => state.hovered = undefined">
              <Button square="true" level="'secondary'" t-if="!element_first" icon="'angle-up'" onClick="() => this.move(element.id, -1)" />
            </div>
            <div t-on-mouseenter="() => state.hovered = element.id" t-on-mouseleave="() => state.hovered = undefined">
              <Button square="true" color="'red'" level="'secondary'" icon="'trash'" onClick="() => this.remove(element.id)" />
            </div>
            <div t-on-mouseenter="() => state.hovered = element.id" t-on-mouseleave="() => state.hovered = undefined">
              <Button square="true" level="'secondary'" t-if="!element_last" icon="'angle-down'" onClick="() => this.move(element.id, 1)" />
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-center mt-4 gap-2">
        <Button size="'sm'" icon="'plus'" level="'secondary'" onClick="() => this.addParagraph()">Paragraph</Button>
        <Button size="'sm'" icon="'plus'" level="'secondary'" onClick="() => this.addPageBreak()">PageBreak</Button>
      </div>
    </div>
  `;

  static props = props;

  static components = {
    Button,
  };

  state = useState<State>({
    elements: [],
  });

  setup() {
    onWillStart(() => {
      // Deep copy letter translatable elements in editor state
      // so that we're working with internal state not updating
      // any remote object directly
      this.state.elements = JSON.parse(JSON.stringify(this.props.letter.translatedElements));

      // This is a common pattern to offer a way for the parent component
      // to access the api exposed by the child one. In this case
      // a function to retrieve the state of the edited translation elements
      this.props.contentRetriever(() => ([...this.state.elements]));
    });
  }

  addParagraph() {
    this.state.elements.push({
      id: Date.now(),
      type: 'paragraph',
      content: '',
    });
  }

  addPageBreak() {
    this.state.elements.push({
      id: Date.now(),
      type: 'pageBreak',
    });
  }

  remove(elemId: string | number) {
    const index = this.state.elements.findIndex(it => it.id === elemId);
    this.state.elements.splice(index, 1);
  }

  move(elemId: string | number, delta: number) {
    // Copy array so that we dont trigger useless repatching
    const items = [...this.state.elements];
    const i = items.findIndex(it => it.id === elemId);
    const elem = items[i];

    // Remove elem from array before adding it back
    items.splice(i, 1);
    items.splice(i + delta, 0, elem);
    this.state.elements = items;
  }
}

export default ContentEditor;