import { Component, useState, xml } from "@odoo/owl";
import TranslatorModal from './TranslatorModal';

class LetterInformationHeader extends Component {

  static template = xml`
    <TranslatorModal onClose="() => this.state.translatorId = undefined" userId="state.translatorId" />
    <div>
      <div class="flex bg-white relative z-10 border-b border-solid border-slate-300">
        <div class="pt-3 pb-5 px-4 mr-10">
          <h4 class="font-semibold text-gray-800 mb-2 text-lg">Child Data</h4>
          <div class="flex text-sm mb-1 text-slate-800">
            <p class="w-32  font-medium">First Name</p>
            <p class="" t-esc="props.letter.child.firstName" />
          </div>
          <div class="flex text-sm mb-1 text-slate-800">
            <p class="w-32  font-medium">Last Name</p>
            <p class="" t-esc="props.letter.child.lastName" />
          </div>
          <div class="flex text-sm mb-1 text-slate-800">
            <p class="w-32  font-medium">Sex</p>
            <p class="" t-esc="props.letter.child.sex === 'M' ? 'Man' : 'Woman'" />
          </div>
          <div class="flex text-sm text-slate-800">
            <p class="w-32  font-medium">Age</p>
            <p class="" t-esc="(props.letter.child.age) + ' Years Old'" />
          </div>
        </div>
        <div class="py-3 px-4 mr-10">
          <h4 class="font-semibold text-gray-800 mb-2 text-lg">Sponsor Data</h4>
          <div class="flex text-sm mb-1 text-slate-800">
            <p class="w-32  font-medium">First Name</p>
            <p class="" t-esc="props.letter.sponsor.firstName" />
          </div>
          <div class="flex text-sm mb-1 text-slate-800">
            <p class="w-32  font-medium">Last Name</p>
            <p class="" t-esc="props.letter.sponsor.lastName" />
          </div>
          <div class="flex text-sm mb-1 text-slate-800">
            <p class="w-32  font-medium">Sex</p>
            <p class="" t-esc="props.letter.sponsor.sex === 'M' ? 'Man' : 'Woman'" />
          </div>
          <div class="flex text-sm text-slate-800">
            <p class="w-32  font-medium">Age</p>
            <p class="" t-esc="(props.letter.sponsor.age) + ' Years Old'" />
          </div>
        </div>
        <div class="py-3 px-4 flex-1">
          <h4 class="font-semibold text-gray-800 mb-2 text-lg">Letter Information</h4>
          <div class="flex text-sm mb-1 text-slate-800">
            <p class="w-32  font-medium">Title</p>
            <p class="" t-esc="props.letter.title" />
          </div>
          <div class="flex text-sm mb-1 text-slate-800">
            <p class="w-32  font-medium">Identifier</p>
            <p class="">1501077</p>
          </div>
          <div class="flex text-sm mb-1 text-slate-800">
            <p class="w-32  font-medium">Language</p>
            <p class="">
              <span t-esc="props.letter.source" />
              <span class="font-semibold mx-1">-></span>
              <span t-esc="props.letter.target" />
            </p>
          </div>
          <div class="flex text-sm text-slate-800">
            <p class="w-32  font-medium">Translator</p>
            <p class="text-blue-600 hover:text-compassion cursor-pointer" t-on-click="() => this.state.translatorId = props.letter.translatorId" t-esc="props.letter.translatorId" />
          </div> 
        </div>
      </div>
    </div>
  `;

  static components = {
    TranslatorModal,
  };

  static props = {
    letter: { type: Object },
  }

  state = useState({
    translatorId: undefined,
  });
}

export default LetterInformationHeader;