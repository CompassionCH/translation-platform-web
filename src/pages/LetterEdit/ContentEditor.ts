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
  modalOpenHelper?: boolean;
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
            <Tippy placement="'left'" content="_('Information about the translation')" delay="200">
              <Button title="'Information'" square="true" level="'secondary'" icon="'info'" t-on-click="() => this.openHelper()" />
            </Tippy>
          </div>
        </div>
      </div>
    </div>

    <Modal active="state.modalOpenHelper !== undefined" title="'Tips for a successful translation'" onClose="() => this.state.modalOpenHelper = undefined">
      <div class="p-4 w-300 px-10 text-sm text-slate-800">
        <p class="font-bold mb-1">
          Phrases in letters that must be reported to us (note in the "comments" section) so that we can inform the sponsor:
        </p>
        <ul class="list-disc px-5 mb-2">
          <li>The sponsor suggests that the child come visit them in Switzerland.</li>
          <li>Private information such as address or phone number.</li>
          <li>Information that the sponsor has contact through Facebook or another social network.</li>
          <li>Inappropriate expression for a child with sexual intention (you are sexy..).</li>
          <li>Suggestion that the child would be a perfect match for a member of the sponsor's family ("I think you would be the perfect girlfriend for my son").</li>
          <li>The sponsor asks the child to call them "mom/dad".</li>
          <li>When the sponsor's letter mentions "I love you" too often and implies more than a friendship (ending a letter with "I love you" is accepted).</li>
          <li>When the sponsor shares his private situation on stories of abuse (“I was beaten”).</li>
          <li>When the sponsor suggests in the letter that they will buy a gift for the child. ("I will buy you a gift so you can buy a bike").</li>
          <li>All photos that may evoke a sexual link (photos of naked children, large necklines, too short shorts).</li>
        </ul>
        <p class="font-bold mb-1">
          Formulation for translations:
        </p>
        <ul class="list-disc px-5 mb-2">
          <li>For Bible verses, simply write the Bible reference.</li>
          <li>For the salutation, simply write "Dear Sponsor", or the sponsor/s' name.</li>
          <li>You can use the informal "tu" pronoun when addressing the sponsors in the letter.</li>
          <li>For the word "project" in English, the translation is "child development center".</li>
          <li>For the date, please write it as such and do not write the date on which you are doing the translation.</li>
        </ul>
        <p class="font-bold mb-1">
          Special instructions for letters from sponsors of children from Bangladesh (BD) and Sri Lanka (LK):
        </p>
        <p>
          The situation in Bangladesh and Sri Lanka is sensitive. We ask sponsors to avoid the following mentions:
        </p>
        <ul class="list-disc px-5 mb-2">
          <li>Asking the child to convert to the Christian faith or encouraging them to initiate a concrete Christian spiritual process.</li>
          <li>Suggesting or writing that Christianity is superior to other religions.</li>
          <li>Mentioning Christian practices such as baptism or the Eucharist.</li>
        </ul>
        <p class="font-bold text-red-500">
          If any of these lines appear in these letters, please leave a note in the "Comments on the translation" field.
        </p>
      </div>
    </Modal>

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

  openSource(elemId: string | number) {
    const elem = this.props.letter.translatedElements.find(it => it.id === elemId);
    if (!elem || elem.type !== 'paragraph') {
      notyf.error(_('Unable to find element'));
    } else {
      this.state.modalSourceElem = (elem as Paragraph).source;
    }
  }

  openHelper() {
    this.state.modalOpenHelper = true;
  }
}

export default ContentEditor;