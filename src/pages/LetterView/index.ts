import { Component, onMounted, useState } from "@odoo/owl";
import template from './letterView.xml';
import { Letter, models } from "../../models";
import notyf from "../../notifications";
import LetterViewer from "../../components/LetterViewer";
import Button from '../../components/Button';
import RouterLink from '../../components/Router/RouterLink';
import CommentReplyModal from '../../components/CommentReplyModal';
import { navigateTo } from "../../components/Router/Router";
import _ from "../../i18n";

type State = {
  loading: boolean;
  replyCommentId?: string | number;
  showReplyModal: boolean;
  letter?: Letter;
};

class LetterView extends Component {
  static template = template;

  static props = {
    letterId: { type: String },
  };

  static components = {
    CommentReplyModal,
    RouterLink,
    LetterViewer,
    Button,
  };

  state = useState<State>({
    loading: false,
    letter: undefined,
    replyCommentId: 0,
    showReplyModal: false,
  });

  setup() {
    this.state.loading = true;
    onMounted(() => this.refreshLetter());
  }

  async refreshLetter() {
    models.letters.find(this.props.letterId).then((letter) => {
      if (!letter) {
        notyf.error(_('Unable to find letter with identifier') + this.props.letterId);
      } else {
        this.state.letter = letter;
      }
      this.state.loading = false;
    });
  }

  async putBackToTranslate() {
    if (!this.state.letter) {
      notyf.error(_('Letter not found'));
      return;
    }

    const validate = window.confirm(_('Are you sure you want to put back this letter to translate ?'));
    if (!validate) return;

    this.state.loading = true;
    const res = await models.letters.makeTranslatable(this.state.letter);
    if (res) {
      notyf.success(_('Letter is back to translate'));
      this.state.letter = undefined; // Put back to undefined to force deep refresh
      return this.refreshLetter();
    } else {
      notyf.error(_('Operation failed, letter remains in current state'));
    }
  }

  async deleteLetter() {
    if (!this.state.letter) {
      notyf.error(_('Letter not found'));
      return;
    }


    const validate = window.confirm(_('Are you sure you want to delete this letter ?'));
    if (!validate) return;

    this.state.loading = true;
    const res = await models.letters.deleteLetter(this.state.letter);
    this.state.loading = false;
    if (res) {
      notyf.success(_('Successfully removed letter'));
      navigateTo('/letters');
    } else {
      notyf.error(_('Unable to delete letter'));
    }
  }
}

export default LetterView;