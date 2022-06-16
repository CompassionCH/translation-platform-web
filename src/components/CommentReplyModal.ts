import { Component, useState, xml } from "@odoo/owl";
import Modal, { ModalLoader } from "./Modal";
import { models } from "../models";
import EditorJS from "@editorjs/editorjs";
import RichEditor from "./RichEditor";
import Button from "./Button";
import notyf from "../notifications";

class CommentReplyModal extends Component {

  static props = {
    letter: { type: Object },
    elementId: { optional: true },
    show: { type: Boolean, optional: true },
    onClose: { type: Function },
  }

  static template = xml`
    <ModalLoader loading="state.loading">
      <Modal active="props.show" title="'Reply to Comment'" onClose="props.onClose">
        <div class="p-4 bg-slate-50">
          <t t-set="element" t-value="props.letter.translatedElements.find(it => it.id === props.elementId)" />
          <div t-if="element !== undefined" class="grid grid-cols-6 w-256 gap-4 mb-4 p-4 border border-solid border-slate-300 bg-slate-100 rounded-sm">
            <div class="col-span-4">
              <p class="text-slate-800 font-medium mb-2">Translated Content</p>
              <p class="text-xs text-slate-600" t-esc="element.content" />
            </div>
            <div class="col-span-2">
              <p class="text-slate-800 font-medium mb-2">Comment</p>
              <p class="text-xs text-slate-800" t-esc="element.comments" />
            </div>
          </div>
          <div class="">
            <p class="text-slate-800 font-medium mb-2">Your Reply</p>
            <RichEditor instanceGetter="(editor) => this.editor = editor" />
          </div>
        </div>
        <t t-set-slot="footer-buttons">
          <Button color="'compassion'" size="'sm'" icon="'paper-plane'" onClick="() => this.sendEmail()">Send Reply</Button>
        </t>
      </Modal>
    </ModalLoader>
  `;

  static components = {
    Modal,
    Button,
    RichEditor,
    ModalLoader,
  };

  editor: EditorJS | undefined = undefined;

  state = useState({
    loading: false,
  });

  async sendEmail() {
    if (!this.editor) return;
    const data = await this.editor.save();
    this.state.loading = true;
    const res = await models.letters.replyToComment(this.props.letter, this.props.elementId, data);
    this.state.loading = false;
    if (res) {
      notyf.success('Reply successfully sent');
      // this.props.onClose();
    } else {
      notyf.error('Unable to send reply, please retry later');
    }
  }
}

export default CommentReplyModal;