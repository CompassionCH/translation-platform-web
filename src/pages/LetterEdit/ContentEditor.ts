import { Component, useState, xml } from "@odoo/owl";
import { Letter, Paragraph } from "../../models/LetterDAO";
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import notyf from "../../notifications";
import Tippy from "../../components/Tippy";
import _ from "../../i18n";

type State = {
  hovered?: string | number;
  modalSourceElem?: string;
};

type Props = {
  letter: Letter;
  onAddParagraph: () => void;
  onAddPageBreak: () => void;
  onRemove: (elemId: string | number) => void;
  onMove: (elemId: string | number, delta: number) => void;
};

const props = {
  letter: { type: Object },
  onAddParagraph: { type: Function, optional: true },
  onAddPageBreak: { type: Function, optional: true },
  onRemove: { type: Function, optional: true },
  onMove: { type: Function, optional: true },
};

/**
 * This component offers a visual editor to translate a letter. It
 * is responsible for displaying the various paragraphs and pageBreaks the user
 * can edit.
 */
class ContentEditor extends Component<Props> {

  static template = xml`
    <div id="content-editor">
      <div t-foreach="this.props.letter.translatedElements" t-as="element" t-key="element.id" class="mx-4 mb-4 border border-solid transition-all editor-element" t-att-class="{
        'border-compassion ring ring-2 ring-compassion ring-opacity-30 ring-offset-0': state.hovered === element.id,
        'border-transparent': state.hovered !== element.id,
      }">
        <div t-if="element.type == 'pageBreak'" class="flex">
            <div class="relative bg-slash flex-1 flex justify-center items-center" t-att-class="{'py-2': element.readonly}">
              <span class="text-slate-500 font-medium text-xs">Page Break</span>
            </div>
          <div class="flex flex-col justify-center gap-2 ml-2">
            <t t-if="element.readonly" >
              <Tippy placement="'left'" content="_('This page break is locked and cannot be removed, it is part of the original content')">
                <Button square="true" disabled="true" level="'secondary'" icon="'lock'" class="'editor-paragraph-locked'" />
              </Tippy>
            </t>
            <div t-if="!element.readonly" t-on-mouseenter="() => state.hovered = element.id" t-on-mouseleave="() => state.hovered = undefined">
              <Button square="true" color="'red'" level="'secondary'" icon="'trash'" onClick="() => this.remove(element.id)" />
            </div>
          </div>
        </div>
        <div t-if="element.type == 'paragraph'" class="flex editor-paragraph">
          <div class="bg-white shadow-xl relative z-10 grid grid-cols-6 flex-1">
            <div class="col-span-4 py-4 px-4 editor-paragraph-content">
              <h4 class="font-medium text-slate-700 mb-2">Translated Content</h4>
              <textarea class="compassion-input w-full h-32 text-xs flex" t-model="element.content" />
            </div>
            <div class="col-span-2 bg-slate-50 p-4 editor-paragraph-comment">
              <h4 class="font-medium text-slate-700 mb-2">Comment</h4>
              <textarea class="compassion-input w-full h-32 text-xs flex" t-model="element.comments" />
            </div>
          </div>
          <div class="flex flex-col justify-center gap-2 ml-2 buttons-element-state">
            <div t-if="!element.readonly" t-on-mouseenter="() => state.hovered = element.id" t-on-mouseleave="() => state.hovered = undefined">
              <Button square="true" level="'secondary'" t-if="!element_first and !this.props.letter.translatedElements[element_index - 1].readonly" icon="'angle-up'" t-on-click="() => this.move(element.id, -1)" />
            </div>
            <div t-if="!element.readonly" t-on-mouseenter="() => state.hovered = element.id" t-on-mouseleave="() => state.hovered = undefined">
              <Button square="true" color="'red'" level="'secondary'" icon="'trash'" t-on-click="() => this.remove(element.id)" />
            </div>
            <div t-if="!element.readonly" t-on-mouseenter="() => state.hovered = element.id" t-on-mouseleave="() => state.hovered = undefined">
              <Button square="true" level="'secondary'" t-if="!element_last and !this.props.letter.translatedElements[element_index + 1].readonly" icon="'angle-down'" t-on-click="() => this.move(element.id, 1)" />
            </div>
            <div t-if="element.readonly" class="flex justify-center">
              <Tippy placement="'left'" content="_('This paragraph is locked and cannot be removed, it is part of the original content')">
                <Button disabled="true" level="'secondary'" icon="'lock'" square="true" />
              </Tippy>
            </div>
            <t t-if="element.readonly">
              <Tippy placement="'left'" content="_('Open Paragraph source text')" delay="200">
                <Button title="'Open source text'" square="true" level="'secondary'" icon="'eye'" t-on-click="() => this.openSource(element.id)" />
              </Tippy>
            </t>
          </div>
        </div>
      </div>
      <div class="flex justify-center mt-4">
        <div class="flex gap-2 buttons-add-elements">
          <Button size="'sm'" icon="'plus'" level="'secondary'" t-on-click="addParagraph">Paragraph</Button>
          <Button size="'sm'" icon="'plus'" level="'secondary'" t-on-click="addPageBreak">PageBreak</Button>
        </div>
      </div>
    </div>
    <Modal active="state.modalSourceElem !== undefined" title="'Source Text'" onClose="() => this.state.modalSourceElem = undefined">
      <div class="p-4 w-128">
        <p class="text-sm text-slate-800" t-if="state.modalSourceElem and state.modalSourceElem.trim() !== ''" t-esc="state.modalSourceElem" />
        <p t-else="" class="italic text-slate-600 font-light">No source text available</p>
      </div>
    </Modal>
  `;

  static props = props;

  static components = {
    Button,
    Tippy,
    Modal,
  };

  state = useState<State>({});

  _ = _;

  addParagraph() {
    this.props.onAddParagraph();
  }

  addPageBreak() {
    this.props.onAddPageBreak();
  }

  move(elemId: string | number, delta: number) {
    this.props.onMove(elemId, delta);
  }

  remove(elemId: string | number) {
    this.props.onRemove(elemId);
  }

  openSource(elemId: string | number) {
    const elem = this.props.letter.translatedElements.find(it => it.id === elemId);
    if (!elem || elem.type !== 'paragraph') {
      notyf.error(_('Unable to find element'));
    } else {
      this.state.modalSourceElem = (elem as Paragraph).source;
    }
  }
}

export default ContentEditor;