import { Component, xml } from "@odoo/owl";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import RouterLink from "../../components/Router/RouterLink";

class LetterSubmittedModal extends Component {

  static template = xml`
    <Modal active="props.active" title="'Thank You'" empty="true">
      <div class="w-128">
        <img src="/logo_simple.png" class="w-16 mx-auto block mt-8" />
        <h1 class="text-center text-3xl font-light text-slate-700 mt-4">Thank You!</h1>
        <p class="text-center text-slate-600 p-4">
          Thank you for your contribution. Your letter will be reviewed before being sent,
          bringing a smile on the face of both <t t-esc="props.letter.child.firstName" /> and <t t-esc="props.letter.sponsor.firstName" />.<br/>
          <span class="block font-semibold pt-4">Thank you in the name of Compassion Switzerland, we are glad to have you in the team!</span>
        </p>
        <div class="flex justify-center mt-4 p-4 border-t border-solid border-slate-300 ">
          <RouterLink to="'/'">
            <Button size="'sm'" level="'secondary'" color="'compassion'" icon="'home'">Bring me back to Home</Button>
          </RouterLink>
        </div>
      </div>
    </Modal>
  `;

  static props = ['active', 'letter'];
  static components = {
    Modal,
    RouterLink,
    Button,
  };
};

export default LetterSubmittedModal;