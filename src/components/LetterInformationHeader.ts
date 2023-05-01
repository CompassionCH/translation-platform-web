import { Component, xml } from "@odoo/owl";
import Loader from "./Loader";
import TranslatorButton from "./TranslatorButton";
import _ from "../i18n";

class LetterInformationHeader extends Component {
  _ = _;

  static template = xml`
    <div t-if="props.letter" id="letter-viewer-header">
      <div class="flex bg-white relative border-b border-solid border-slate-300">
        <div class="pt-3 pb-5 px-4 mr-10">
          <h4 class="font-semibold text-gray-800 mb-2 text-lg">Child Data</h4>
          <div class="flex text-sm mb-1 text-slate-800">
            <p class="w-32  font-medium">Preferred Name</p>
            <p class="" t-esc="props.letter.child.preferredName" />
          </div>
          <div class="flex text-sm mb-1 text-slate-800">
            <p class="w-32  font-medium">Sex</p>
            <p class="" t-esc="props.letter.child.sex === 'M' ? _('Man') : _('Woman')" />
          </div>
          <div class="flex text-sm text-slate-800">
            <p class="w-32  font-medium">Age</p>
            <p class="" t-esc="(props.letter.child.age) + _(' Years Old')" />
          </div>
        </div>
        <div class="py-3 px-4 mr-10">
          <h4 class="font-semibold text-gray-800 mb-2 text-lg">Sponsor Data</h4>
          <div class="flex text-sm mb-1 text-slate-800">
            <p class="w-32  font-medium">Preferred Name</p>
            <p class="" t-esc="props.letter.sponsor.preferredName" />
          </div>
          <div class="flex text-sm mb-1 text-slate-800">
            <p class="w-32  font-medium">Sex</p>
            <p class="" t-esc="props.letter.sponsor.sex === 'M' ? _('Man') : _('Woman')" />
          </div>
          <div class="flex text-sm text-slate-800">
            <p class="w-32  font-medium">Age</p>
            <p class="" t-esc="(props.letter.sponsor.age) + _(' Years Old')" />
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
            <p class="" t-esc="props.letter.id" />
          </div>
          <div class="flex text-sm mb-1 text-slate-800">
            <p class="w-32  font-medium">Language</p>
            <p class="">
              <span t-esc="_(props.letter.source)" />
              <span class="font-semibold mx-1" t-translation="off">-></span>
              <span t-esc="_(props.letter.target)" />
            </p>
          </div>
          <div class="flex text-sm text-slate-800">
            <p class="w-32  font-medium">Translator</p>
            <TranslatorButton t-if="props.letter.translatorId" translatorId="props.letter.translatorId" />
          </div>
        </div>
      </div>
    </div>
    <div class="bg-slate-100 px-4 py-3 border-b border-solid border-slate-300 flex justify-between shadow-sm items-center z-20 relative">
      <div t-if="props.letter" class="flex items-center gap-2">
        <span class="rounded-sm py-0.5 px-1 text-xs font-medium text-white" t-att-class="{
          'bg-red-500': props.letter.translationIssue,
          'bg-slate-500': !props.letter.translationIssue
        }" t-esc="props.letter.status" />
        <p class="text-sm text-slate-600">
          <t t-if="props.letter.lastUpdate">
            Last updated the <span t-esc="props.letter.lastUpdate.toLocaleString()" />
          </t>
          <span t-else="">Never Modified</span>
        </p>
        <Loader t-if="props.loading" />
      </div>
      <div class="flex gap-3 items-center">
        <t t-slot="default" />
      </div>
    </div>
  `;

  static components = {
    Loader,
    TranslatorButton,
  };

  static props = {
    letter: { type: Object, optional: true },
    slots: { optional: true },
    loading: { type: Boolean, optional: true },
  }
}

export default LetterInformationHeader;