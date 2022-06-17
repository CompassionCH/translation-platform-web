import { Component, xml } from "@odoo/owl";
import Modal from "./Modal";
import Button from "./Button";

class SignalProblem extends Component {
  static template = xml`  
    <Modal active="props.active" onClose="props.onClose" title="'Signal a Problem'" subtitle="'Notify Compassion of a problem with this letter'">
      <div class="p-4">
        <select class="compassion-input text-sm mb-2">
          <option checked="true">Incorrect Letter</option>
          <option>PDF not displaying</option>
        </select>
        <textarea class="compassion-input text-sm" placeholder="Your Message" />
      </div>
      <t t-set-slot="footer-buttons">
        <Button color="'compassion'" size="'sm'">Send Message</Button>
      </t>
    </Modal>
  `;

  static props = {
    active: { type: Boolean },
    onClose: { type: Function },
  };

  static components = {
    Modal,
    Button,
  };
}

export default SignalProblem;