import { Component, onWillUpdateProps, useState, xml } from "@odoo/owl";
import notyf from "../notifications";

import { models, Translator } from "../models";
import TranslationSkills from "./TranslationSkills";
import Modal from "./Modal";
import Loader from './Loader';
import _ from "../i18n";

type State = {
  loading: boolean;
  active: boolean;
  translator?: Translator;
  title?: string;
}

class TranslatorModal extends Component {

  static template = xml`
    <Modal title="state.title" active="state.active" onClose="() => this.onClose()" loading="state.loading">
      <div t-if="state.translator" class="w-156 grid grid-cols-2">
        <div class="bg-slate-100 border-r border-solid border-slate-200 p-4">
          <div class="mb-4">
            <div class="flex mb-2">
              <p class="font-semibold text-sm text-slate-700 w-32">Identifier</p>
              <p class="text-sm text-slate-700" t-esc="props.translatorId" />
            </div>
            <div class="flex mb-2">
              <p class="font-semibold text-sm text-slate-700 w-32">Name</p>
              <p class="text-sm text-slate-700" t-esc="state.translator.name" />
            </div>
            <div class="flex mb-2">
              <p class="font-semibold text-sm text-slate-700 w-32">E-Mail</p>
              <p class="text-sm text-slate-700" t-esc="state.translator.email" />
            </div>
            <div class="flex mb-2">
              <p class="font-semibold text-sm text-slate-700 w-32">Language</p>
              <p class="text-sm text-slate-700" t-esc="_(state.translator.language)" />
            </div>
          </div>
          <div class="flex justify-around">
            <div class="flex flex-col items-center">
              <h3 class="font-semibold text-xl text-slate-800" t-esc="state.translator.year" />
              <p class="font-medium text-xs text-slate-600">This Year</p>
            </div>
            <div class="flex flex-col items-center">
              <h3 class="font-semibold text-xl text-slate-800" t-esc="state.translator.lastYear" />
              <p class="font-medium text-xs text-slate-600">Last Year</p>
            </div>
            <div class="flex flex-col items-center">
              <h3 class="font-semibold text-xl text-slate-800" t-esc="state.translator.total" />
              <p class="font-medium text-xs text-slate-600">All Time</p>
            </div>
          </div>
        </div>
        <div class="p-4 flex flex-col items-center">
          <h3 class="font-semibold text-sm text-slate-700 mb-2">Translation Skills</h3>
          <TranslationSkills skills="state.translator.skills" translatorId="state.translator.translatorId" />
        </div>
      </div>
    </Modal>
  `;

  static props = {
    translatorId: { type: Number, optional: true },
    onClose: { type: Function, optional: true },
  };

  static components = {
    Modal,
    Loader,
    TranslationSkills,
  };

  _ = _;

  state = useState<State>({
    loading: false,
    active: false,
    translator: undefined,
    title: undefined,
  });

  setup(): void {
    this.fetchTranslator(this.props.translatorId);
    onWillUpdateProps((nextProps) => {
      this.fetchTranslator(nextProps.translatorId);
    });
  }

  onClose() {
    this.props.onClose();
    setTimeout(() => {
      this.state.translator = undefined;
      this.state.title = undefined;
    }, 300);
  }

  fetchTranslator(translatorId: number) {
    if (translatorId) {
      this.state.loading = true;
      this.state.active = true;
      models.translators.find(translatorId).then((user) => {
        if (!user) {
          notyf.error(_('User not found'));
          this.state.active = false;
          this.state.loading = false;
          this.props.onClose();
        } else {
          this.state.loading = false;
          this.state.translator = user;
          this.state.title = user.name;
        }
      });
    } else {
      // Keep internal state while modal is closing
      this.state.active = false;
      this.state.loading = false;
    }
  }
}

export default TranslatorModal;