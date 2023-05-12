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
                Phrases in letters that must be reported to us (note in the "Comment on the translation" section) so that we can inform the sponsor:
            </p>
            <ul class="list-disc px-5 mb-2">
                <li>The sponsor suggests that the child come visit them in Switzerland.</li>
                <li>Private information such as address or phone number.</li>
                <li>Inappropriate expression for a child with sexual intention (you are sexy..).</li>
                <li>Information that is not age-appropriate (detailed descriptions of war, conspiracy theories, etc.)</li>
                <li>Suggestion that the child would be a perfect match for a member of the sponsor's family ("I think you would be the perfect girlfriend for my son").</li>
                <li>The sponsor asks the child to call them "mom/dad".</li>
                <li>When the sponsor's letter mentions "I love you" too often and implies more than a friendship (ending a letter with "I love you" is accepted).</li>
                <li>When the sponsor shares his private situation on stories of abuse (“I was beaten”).</li>
                <li>All photos that may evoke a sexual link (photos of naked children, large necklines, too short shorts).</li>
            </ul>
            <p class="font-bold mb-1">
                For sponsorship letters to children in Bangladesh (BD) and Sri Lanka (LK), here are some additional elements that you absolutely must report to us:
            </p>
            <ul class="list-disc px-5 mb-2">
                <li>Invitations to profess the Christian faith</li>
                <li>Invitation to take concrete steps in faith</li>
                <li>Superiority of Christianity over other religions</li>
                <li>Mention of Christian practices (conversion, baptism, etc.)</li>
            </ul>
            <p class="font-bold mb-1">
                Next, here are some principles we have adopted for translations:
            </p>
            <ul class="list-disc px-5 mb-2">
                <li>Always write the date of the letter and not that of the translation.</li>
                <li>Sponsors are greeted by their first name: "Dear Monika" (no mention of last name).</li> 
                <li>You can use informal communication when addressing the sponsors in the letter.</li>
                <li>You can refer to Bible verses, for example Psalm 23.</li>
                <li>For the word "project" in English, the translation is "child development center".</li> 
                <li>Thank you in advance for translating as closely as possible to the original text.</li> 
                <li>Keep the information you handle confidential.</li> 
                <li>Complete the translation of a letter as quickly as possible.</li>
            </ul>
            <p class="font-bold text-red-500">
                If any of these lines appear in these letters, please leave a note in the "Comments on the translation" field.
            </p>
        </div>
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

export default TipsModal;