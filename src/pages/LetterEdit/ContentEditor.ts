import { Component, useState, xml } from "@odoo/owl";
import { Letter, Paragraph } from "../../models/LetterDAO";
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import notyf from "../../notifications";
import Tippy from "../../components/Tippy";
import TipsModal from "../../components/TipsModal";
import _ from "../../i18n";

type State = {
  hovered?: string | number;
  modalSourceElem?: string;
  modalOpenTips?: boolean;
};

type Props = {
  letter: Letter;
};

const props = {
  letter: { type: Object },
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
            <div class="relative bg-slash flex-1 flex justify-center items-center py-2">
              <span class="text-slate-500 font-medium text-xs">Page Break</span>
            </div>
        </div>
        <div t-if="element.type == 'paragraph'" class="flex editor-paragraph">
          <div class="bg-white shadow-xl relative z-10 grid grid-cols-6 flex-1">
            <div class="col-span-4 py-4 px-4 editor-paragraph-content">
              <h4 class="font-medium text-slate-700 mb-2">Translated Content</h4>
              <textarea class="compassion-input w-full h-32 text-xs flex" t-model="element.content" />
            </div>
            <div class="col-span-2 bg-slate-50 p-4 editor-paragraph-comment">
              <h4 class="font-medium text-slate-700 mb-2">Comment on the translation</h4>
              <textarea class="compassion-input w-full h-32 text-xs flex" t-model="element.comments" />
            </div>
          </div>
          <div class="flex flex-col justify-center gap-2 ml-2 buttons-element-state">
            <Tippy placement="'left'" content="_('Open Paragraph source text')" delay="200">
              <Button title="'Open source text'" square="true" level="'secondary'" icon="'eye'" t-on-click="() => this.openSource(element.id)" />
            </Tippy>
            <Tippy placement="'left'" content="_('Tips for a successful translation')" delay="200">
              <Button title="'Tips for a successful translation'" square="true" level="'secondary'" icon="'info'" t-on-click="() => this.openTips()" />
            </Tippy>
          </div>
        </div>
      </div>
    </div>

    <TipsModal onClose="() => this.state.modalOpenTips = undefined" active="state.modalOpenTips !== undefined"/>

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
    TipsModal
  };

  state = useState<State>({});

  _ = _;

  openSource(elemId: string | number) {
    const elem = this.props.letter.translatedElements.find(it => it.id === elemId);
    if (!elem || elem.type !== 'paragraph') {
      notyf.error(_('Unable to find element'));
    } else {
      this.state.modalSourceElem = (elem as Paragraph).source;
    }
  }

  openTips() {
    this.state.modalOpenTips = true;
  }
}

export default ContentEditor;