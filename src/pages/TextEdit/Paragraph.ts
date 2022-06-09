import { Component, xml } from "@odoo/owl";
import Button from "../../components/Button";
import useWatch from "../../hooks/useWatch";

class PageBreak extends Component {

  static template = xml`
    <div class="flex">
      <div class="bg-white rounded shadow-lg flex-1 p-4">
        <div class="grid grid-cols-5 gap-5">
          <div class="col-span-3">
            <h3 class="text-slate-700 text-sm font-medium">Paragraph</h3>
            <p class="text-slate-600 text-xs mb-2">Translated transcription of the text</p>
            <textarea t-model="state.text" class="compassion-input" />
          </div>
          <div class="col-span-2">
            <h3 class="text-slate-700 text-sm font-medium">Comment</h3>
            <p class="text-slate-600 text-xs mb-2">For any communication</p>
            <textarea t-model="state.comment" class="compassion-input" />
          </div>
        </div>
      </div>
      <div class="flex flex-col justify-center pl-3">
        <Button t-if="!this.props.first" circle="true" class="'mb-2'" level="'secondary'" color="'slate'" icon="'angle-up'" onClick="this.props.onMoveUp" />
        <Button circle="true" class="'mb-2'" level="'secondary'" color="'red'" icon="'trash'" onClick="this.props.onRemove" />
        <Button t-if="!this.props.last" circle="true" class="'mb-2'" level="'secondary'" color="'slate'" icon="'angle-down'" onClick="this.props.onMoveDown" />
      </div>
    </div>
  `;

  static components = {
    Button,
  };

  static props = [
    'onRemove',
    'onMoveUp',
    'onMoveDown',
    'onChange',
    'element',
    'first',
    'last',
  ];

  state = useWatch({
    comment: '',
    text: '',
  }, () => this.onContentChange());

  onContentChange() {
    this.props.onChange({ text: this.state.text, comment: this.state.comment });
  }
}

export default PageBreak;