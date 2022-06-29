import { Component, useState, xml } from "@odoo/owl";
import Modal, { ModalLoader } from "./Modal";
import { models } from "../models";
import EditorJS, { OutputBlockData } from "@editorjs/editorjs";
import RichEditor from "./RichEditor";
import Button from "./Button";
import notyf from "../notifications";
import _ from "../i18n";

class CommentReplyModal extends Component {

  static props = {
    letter: { type: Object },
    show: { type: Boolean, optional: true },
    onSent: { type: Function, optional: true },
    onClose: { type: Function },
  }

  static template = xml`
    <Modal active="props.show" title="'Reply to Comment'" onClose="props.onClose" loading="state.loading">
      <div class="w-310 grid grid-cols-2">
        <div class="p-4 bg-slate-100 border-r border-solid border-slate-200">
          <p class="text-slate-800 font-medium text-lg mb-2">Comments</p>
          <t t-foreach="props.letter.translatedElements" t-as="item" t-key="item.id">
            <div t-if="item.type === 'paragraph' and item.comments !== false" class="mb-3 bg-white rounded-sm border border-solid border-slate-300 shadow-xs">
              <p class="text-slate-700 text-sm bg-slate-200 p-3 max-h-32 overflow-auto" t-esc="item.content" />
              <div class="p-3 border-t border-solid border-slate-300">
                <p class="text-slate-700 font-medium">Comment</p>
                <p class="text-slate-700 text-sm" t-esc="item.comments" />
              </div>
            </div>
          </t>
        </div>
        <div class="p-4">
          <p class="text-slate-800 font-medium mb-2">Your Reply</p>
          <RichEditor instanceGetter="(editor) => this.editor = editor" />
          <p class="text-xs text-slate-600 mt-2">The reply e-mail will include the comments.</p>
        </div>
      </div>
      <t t-set-slot="footer-buttons">
        <Button color="'compassion'" size="'sm'" icon="'paper-plane'" onClick="() => this.sendEmail()">Send Reply</Button>
      </t>
    </Modal>
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

    // Mappers to generate HTML code from editorjs' output data
    const mappers = {
      paragraph: (item: OutputBlockData) => `<p>${item.data.text}</p>`,
      image: (item: OutputBlockData) => `<img src="${item.data.file.url}" alt="${item.data.caption}" />`,
      list: (item: OutputBlockData) => {
        const tag = item.data.style === 'ordered' ? 'ol' : 'ul';
        return `<${tag}>${item.data.items.map((it: string) => `<li>${it}</li>`).join('')}</${tag}>`;
      },
    };

    try {
      const html = data.blocks.map(it => Object.keys(mappers).includes(it.type) ? mappers[it.type as keyof typeof mappers](it) : '').join('');
      this.state.loading = true;
      const res = await models.letters.replyToComments(this.props.letter, html);
      this.state.loading = false;
      if (res) {
        notyf.success(_('Reply successfully sent'));
        if (this.props.onSent) {
          this.props.onSent();
        } else {
          this.props.onClose();
        }
      } else {
        notyf.error(_('Unable to send reply, please retry later'));
      }
    } catch (e) {
      console.error(e);
      notyf.error(_('Unable to generate e-mail from text, please try to rewrite it "simpler"'));
    }
  }
}

export default CommentReplyModal;