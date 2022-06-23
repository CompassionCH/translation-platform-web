/**
 * This hook can be used to display nice alerts and confirms
 * prompts in place of vanilla ones. Modals are defined in
 * the layout and sub components can access this hook to trigger
 * alerts.
 */

import { reactive, useState, Component, xml } from "@odoo/owl";
import Modal from '../components/Modal';
import Button from '../components/Button';


const alertsState = reactive({
  confirmText: undefined as string | undefined,
  confirmRes: undefined as boolean | undefined,
  watcher: undefined as ((res: boolean) => void) | undefined,
}, () => {
  console.log('Changed', alertsState);
  if (alertsState.watcher && alertsState.confirmRes !== undefined) {
    alertsState.watcher(alertsState.confirmRes);
    alertsState.confirmRes = undefined;
    alertsState.confirmText = undefined;
    alertsState.watcher = undefined;
  }
});

const confirm = async (text: string) => {
  alertsState.confirmText = text;
  return new Promise((resolve) => {
    alertsState.watcher = (res: boolean) => resolve(res);
  });
};



/**
 * The Confirm component is declared here to have all the code
 * in the same place
 */
class ConfirmModal extends Component {
  static template = xml`
    <Modal active="state.confirmText !== undefined">
      <div class="p-4" t-esc="state.confirmText" />
      <t t-set-slot="footer-buttons">
        <Button size="'sm'" level="'secondary'" onClick="() => resolve('false')">Cancel</Button>
        <Button size="'sm'" color="'compassion'" onClick="() => resolve('true')">Confirm</Button>
      </t>
    </Modal>
  `;
 
  static components = {
    Modal,
    Button,
  };

  state = useState(alertsState);

  resolve(response: boolean) {
    this.state.confirmRes = response;
  }
};
 
export {
  ConfirmModal,
  confirm,
}