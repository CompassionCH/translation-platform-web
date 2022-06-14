import { Component, xml } from "@odoo/owl";
import Modal from "../../components/Modal";
import Button from "../../components/Button";

class BatchEditModal extends Component {

  static template = xml`
    <Modal title="'Edit Letters'" subtitle="'Batch edit multiple letters in a single pass'" active="props.active" onClose="props.onClose">
      <form action="" class="p-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-slate-800 font-medium text-xs">Source Language</label>
            <select class="compassion-input text-sm" placeholder="Source Language">
              <option selected="">Keep Current</option>
              <option>German</option>
              <option>Italian</option>
              <option>French</option>
            </select>
          </div>
          <div>
            <label class="text-slate-800 font-medium text-xs">Target Language</label>
            <select class="compassion-input text-sm" placeholder="Target Language">
              <option selected="">Keep Current</option>
              <option>German</option>
              <option>Italian</option>
              <option>French</option>
            </select>
          </div>
        </div>
      </form>
      <t t-set-slot="footer-buttons">
        <Button size="'sm'" color="'compassion'">Confirm</Button>
      </t>
    </Modal>
  `;

  static components = {
    Modal,
    Button,
  };

  static props = {
    active: { type: Boolean, optional: false },
    onClose: { type: Function, optional: false },
  };
}

export default BatchEditModal;