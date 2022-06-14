import { Component, useState, xml } from "@odoo/owl";
import TranslatorModal from './TranslatorModal';

class LetterInformationHeader extends Component {

  static template = xml`
    <TranslatorModal onClose="() => this.state.translatorId = undefined" userId="state.translatorId" />
    <div>
      <div class="flex bg-white shadow-lg relative z-10 border-b border-solid border-slate-200">
        <div class="py-3 px-4 mr-10">
          <h4 class="font-semibold text-gray-800 border-b border-solid border-gray-100 mb-2">Child Data</h4>
          <div class="flex text-sm mb-0.5">
            <p class="w-32 text-slate-700 font-medium">First Name</p>
            <p class="text-slate-800" t-esc="props.letter.child.firstName" />
          </div>
          <div class="flex text-sm mb-0.5">
            <p class="w-32 text-slate-700 font-medium">Last Name</p>
            <p class="text-slate-800" t-esc="props.letter.child.lastName" />
          </div>
          <div class="flex text-sm mb-0.5">
            <p class="w-32 text-slate-700 font-medium">Sex</p>
            <p class="text-slate-800" t-esc="props.letter.child.sex === 'M' ? 'Man' : 'Woman'" />
          </div>
          <div class="flex text-sm">
            <p class="w-32 text-slate-700 font-medium">Age</p>
            <p class="text-slate-800" t-esc="(props.letter.child.age) + ' Years Old'" />
          </div>
        </div>
        <div class="py-3 px-4 mr-10">
          <h4 class="font-semibold text-gray-800 border-b border-solid border-gray-100 mb-2">Sponsor Data</h4>
          <div class="flex text-sm mb-0.5">
            <p class="w-32 text-slate-700 font-medium">First Name</p>
            <p class="text-slate-800" t-esc="props.letter.sponsor.firstName" />
          </div>
          <div class="flex text-sm mb-0.5">
            <p class="w-32 text-slate-700 font-medium">Last Name</p>
            <p class="text-slate-800" t-esc="props.letter.sponsor.lastName" />
          </div>
          <div class="flex text-sm mb-0.5">
            <p class="w-32 text-slate-700 font-medium">Sex</p>
            <p class="text-slate-800" t-esc="props.letter.sponsor.sex === 'M' ? 'Man' : 'Woman'" />
          </div>
          <div class="flex text-sm">
            <p class="w-32 text-slate-700 font-medium">Age</p>
            <p class="text-slate-800" t-esc="(props.letter.sponsor.age) + ' Years Old'" />
          </div>
        </div>
        <div class="py-3 px-4 flex-1">
          <h4 class="font-semibold text-gray-800 border-b border-solid border-gray-100 mb-2">Letter Information</h4>
          <div class="flex text-sm mb-0.5">
            <p class="w-32 text-slate-700 font-medium">Letter Title</p>
            <p class="text-slate-800" t-esc="props.letter.title" />
          </div>
          <div class="flex text-sm mb-0.5">
            <p class="w-32 text-slate-700 font-medium">Letter Identifier</p>
            <p class="text-slate-800">1501077</p>
          </div>
          <div class="flex text-sm">
            <p class="w-32 text-slate-700 font-medium">Language</p>
            <p class="text-slate-800">
              <span t-esc="props.letter.source" />
              <span class="font-semibold mx-1">-></span>
              <span t-esc="props.letter.target" />
            </p>
          </div>
          <div class="flex text-sm mb-0.5">
            <p class="w-32 text-slate-700 font-medium">Translator</p>
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