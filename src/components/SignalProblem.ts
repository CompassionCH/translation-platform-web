import { Component, useState, xml } from "@odoo/owl";
import Modal from "./Modal";
import Button from "./Button";
import { models } from "../models";
import { IssueType } from "../models/SettingsDAO";
import notyf from "../notifications";
import _ from "../i18n";

class SignalProblem extends Component {
  static template = xml`  
    <Modal active="props.active" onClose="props.onClose" title="'Signal a Problem'" subtitle="'Notify Compassion of a problem with this letter'" loading="state.loading">
      <div class="p-4 signal-problem-modal">
        <select class="compassion-input text-sm mb-2" t-model="state.type">
          <option t-foreach="state.types" t-as="type" t-key="type.id" t-att-value="type.id" t-esc="type.text" />
        </select>
        <textarea class="compassion-input text-sm" t-model="state.message" placeholder="Your Message" />
      </div>
      <t t-set-slot="footer-buttons">
        <Button color="'compassion'" size="'sm'" onClick="() => this.submit()">Send Message</Button>
      </t>
    </Modal>
  `;

  static props = {
    letterId: { },
    active: { type: Boolean },
    onClose: { type: Function },
  };

  static components = {
    Modal,
    Button,
  };

  state = useState({
    loading: false,
    message: '',
    type: null as string | null,
    types: [] as IssueType[],
  });

  setup() {
    this.state.loading = true;
    models.settings.letterIssues().then((res) => {
      this.state.types = res;
      this.state.type = res[0].id;
      this.state.loading = false;
    });
  }

  async submit() {
    if (!this.state.type) {
      notyf.error(_('Please select a problem in the list'));
      return;
    }

    this.state.loading = true;
    const ok = await models.letters.reportIssue(this.props.letterId, this.state.type, this.state.message);
    this.state.loading = false;
    if (!ok) {
      notyf.error(_('Unable to submit issue'));
    } else {
      notyf.success(_('Issue successfully sent, it will be quickly reviewed'));
      this.props.onClose();
      location.reload();
    }
  }
}

export default SignalProblem;