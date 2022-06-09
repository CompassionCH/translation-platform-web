import { Component, xml } from "@odoo/owl";
import Modal from "../../components/Modal";
import Button from "../../components/Button";

class SignalProblem extends Component {
  static template = xml`  
    <Modal active="props.active" onClose="props.onClose" title="'Problem Encountered'" subtitle="'Notify Compassion of a problem with this letter'">
      <div class="p-4">
        <p class="text-sm text-justify mb-4 text-slate-600">This tool allows you to report a problem to the Compassion team.<br/>Once done it will be quickly reviewed and we will come back to you.</p>
        <select class="compassion-input mb-2">
          <option checked="true">Incorrect Letter</option>
          <option>PDF not displaying</option>
        </select>
        <textarea class="compassion-input" placeholder="Your Message" />
      </div>
      <t t-set-slot="footer-buttons">
        <Button size="'sm'">Send Message</Button>
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