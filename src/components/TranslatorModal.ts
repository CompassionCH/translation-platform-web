import { Component, onWillUpdateProps, useState, xml } from "@odoo/owl";
import notyf from "../notifications";

import { models, User } from "../models";
import TranslationSkills from "./TranslationSkills";
import Modal from "./Modal";
import Loader from './Loader';

type State = {
  loading: boolean;
  active: boolean;
  user?: User;
  title?: string;
}

class TranslatorModal extends Component {

  static template = xml`
    <Modal title="state.title" active="state.active" onClose="() => this.onClose()" loading="state.loading">
      <div t-if="state.user" class="w-156 grid grid-cols-2">
        <div class="bg-slate-100 border-r border-solid border-slate-200 p-4">
          <div class="mb-4">
            <div class="flex mb-2">
              <p class="font-semibold text-sm text-slate-700 w-32">Username</p>
              <p class="text-sm text-slate-700" t-esc="state.user.username" />
            </div>
            <div class="flex mb-2">
              <p class="font-semibold text-sm text-slate-700 w-32">Name</p>
              <p class="text-sm text-slate-700" t-esc="state.user.name" />
            </div>
            <div class="flex mb-2">
              <p class="font-semibold text-sm text-slate-700 w-32">E-Mail</p>
              <p class="text-sm text-slate-700" t-esc="state.user.email" />
            </div>
            <div class="flex mb-2">
              <p class="font-semibold text-sm text-slate-700 w-32">Language</p>
              <p class="text-sm text-slate-700" t-esc="state.user.language" />
            </div>
          </div>
          <div class="flex justify-around">
            <div class="flex flex-col items-center">
              <h3 class="font-semibold text-xl text-slate-800" t-esc="state.user.year" />
              <p class="font-medium text-xs text-slate-600">This Year</p>
            </div>
            <div class="flex flex-col items-center">
              <h3 class="font-semibold text-xl text-slate-800" t-esc="state.user.lastYear" />
              <p class="font-medium text-xs text-slate-600">Last Year</p>
            </div>
            <div class="flex flex-col items-center">
              <h3 class="font-semibold text-xl text-slate-800" t-esc="state.user.total" />
              <p class="font-medium text-xs text-slate-600">All Time</p>
            </div>
          </div>
        </div>
        <div class="p-4 flex flex-col items-center">
          <h3 class="font-semibold text-sm text-slate-700 mb-2">Translation Skills</h3>
          <TranslationSkills skills="state.user.skills" />
        </div>
      </div>
    </Modal>
  `;

  static props = {
    userId: { type: String, optional: true },
    onClose: { type: Function, optional: true },
  };

  static components = {
    Modal,
    Loader,
    TranslationSkills,
  };

  state = useState<State>({
    loading: false,
    active: false,
    user: undefined,
    title: undefined,
  });

  setup(): void {
    this.fetchUser(this.props.userId);
    onWillUpdateProps((nextProps) => {
      this.fetchUser(nextProps.userId);
    });
  }

  onClose() {
    this.props.onClose();
    setTimeout(() => {
      this.state.user = undefined;
      this.state.title = undefined;
    }, 300);
  }

  fetchUser(userId: number) {
    if (userId) {
      this.state.loading = true;
      this.state.active = true;
      models.users.find(userId).then((user) => {
        if (!user) {
          notyf.error('User not found');
          this.state.active = false;
          this.state.loading = false;
          this.props.onClose();
        } else {
          this.state.loading = false;
          this.state.user = user;
          this.state.title = user.username;
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