import { Component, xml } from "@odoo/owl";
import Modal from "./Modal";
import Button from "./Button";


/**
 * This component shows the translations guidelines and tips as a pop-up
 */
class TipsModal extends Component {
  static template = xml`
    <Modal active="props.active" title="'Tips for a successful translation'" onClose="props.onClose">
        <div class="p-4 w-300 px-10 text-sm text-slate-800">
            <p class="font-bold mb-1">
                Phrases in letters that must be reported to us (note in the "comments" section) so that we can inform the sponsor:
            </p>
            <ul class="list-disc px-5 mb-2">
                <li>The sponsor suggests that the child come visit them in Switzerland.</li>
                <li>Private information such as address or phone number.</li>
                <li>Information that the sponsor has contact through Facebook or another social network.</li>
                <li>Inappropriate expression for a child with sexual intention (you are sexy..).</li>
                <li>Suggestion that the child would be a perfect match for a member of the sponsor's family ("I think you would be the perfect girlfriend for my son").</li>
                <li>The sponsor asks the child to call them "mom/dad".</li>
                <li>When the sponsor's letter mentions "I love you" too often and implies more than a friendship (ending a letter with "I love you" is accepted).</li>
                <li>When the sponsor shares his private situation on stories of abuse (“I was beaten”).</li>
                <li>When the sponsor suggests in the letter that they will buy a gift for the child. ("I will buy you a gift so you can buy a bike").</li>
                <li>All photos that may evoke a sexual link (photos of naked children, large necklines, too short shorts).</li>
            </ul>
            <p class="font-bold mb-1">
                Formulation for translations:
            </p>
            <ul class="list-disc px-5 mb-2">
                <li>For Bible verses, simply write the Bible reference.</li>
                <li>For the salutation, simply write "Dear Sponsor", or the sponsor/s' name.</li>
                <li>You can use the informal "tu" pronoun when addressing the sponsors in the letter.</li>
                <li>For the word "project" in English, the translation is "child development center".</li>
                <li>For the date, please write it as such and do not write the date on which you are doing the translation.</li>
            </ul>
            <p class="font-bold mb-1">
                Special instructions for letters from sponsors of children from Bangladesh (BD) and Sri Lanka (LK):
            </p>
            <p>
                The situation in Bangladesh and Sri Lanka is sensitive. We ask sponsors to avoid the following mentions:
            </p>
            <ul class="list-disc px-5 mb-2">
                <li>Asking the child to convert to the Christian faith or encouraging them to initiate a concrete Christian spiritual process.</li>
                <li>Suggesting or writing that Christianity is superior to other religions.</li>
                <li>Mentioning Christian practices such as baptism or the Eucharist.</li>
            </ul>
            <p class="font-bold text-red-500">
                If any of these lines appear in these letters, please leave a note in the "Comments on the translation" field.
            </p>
        </div>
    </Modal>
  `;

  static props = ['onClose', 'active'];

  static components = {
    Modal,
    Button,
  };


}

export default TipsModal;