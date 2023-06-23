import { Component, xml, markup } from "@odoo/owl";
import Modal from "./Modal";
import { FR, DE, GB, IT } from 'country-flag-icons/string/3x2';
import { selectedLang, setLanguage } from "../i18n";
import Button from "./Button";
import { useStore } from "../store";
import t_ from "../i18n";


/**
 * This component shows the Child Protection related information
 */
class ChildModal extends Component {
  static template = xml`
    <Modal active="props.active" onClose="props.onClose" title="'Child Protection'">
      <div class="w-256">
        <div class="p-4 child-protection-text">
          <div class="flex flex-col mb-3">
            <p class="text-sm font-semibold text-slate-700 mb-2">Expected/acceptable behaviors:</p>
            <ul class="list-disc ml-4 mb-4 text-sm">
              <li class="mb-2">I will demonstrate the proper respect and dignity of all children and will demonstrate Jesus’s love
              and care for them, regardless of their gender, age, race, religion, social background, culture, special
              need or disability.</li>
              <li class="mb-2">I will maintain appropriate and reasonable expectations for children based on their age and ability
              level. (For example, it is developmentally normal for a three-year-old to become upset easily when
              they are tired but we could expect a teenager to manage their emotions even when they are very
              tired.)</li>
              <li class="mb-2">I will engage in age-appropriate communication with beneficiaries.</li>
              <li class="mb-2">I will submit to the appropriate background or police checks as permissible by law prior to face-to-face contact with beneficiaries (at minimum – an employee may be requested to comply with background/police checks at hire).</li>
              <li class="mb-2">I will engage in activities with beneficiaries only in open or visible places, and in the event that an
              activity needs to take place in an enclosed space, I will ensure that at least one other approved adult
              is present.</li>
              <li class="mb-2">If I witness child abuse, know a child is in danger, observe any concerning behaviors from colleagues,
              partners or other representatives, or a child comes to me with a report of abuse, I will take it seriously
              and report it to the proper staff or relevant authorities. I will seek to do everything within my power
              to ensure the child is out of danger.</li>
              <li class="mb-2">I will keep all information about child protection investigations confidential, keeping in mind privacy
              and dignity concerns of all involved.</li>
              <li class="mb-2">If requested, I will comply with child protection related investigations and make available any
              documentation or other information necessary for the completion of the investigation.</li>
              <li class="mb-2">I will contribute to building an environment where children are respected and encouraged to discuss
              their concerns and rights.</li>
              <li class="mb-2">I will follow Compassion’s rules about communication with beneficiaries, including social media
              interaction.</li>
              <li class="mb-2">I will follow dignity standards (for example, only recording children who are dressed appropriately,
                understand they are being recorded, etc.) regarding child photography and videography.</li>
              <li class="mb-2">I will be careful about my appearance, language, action, to ensure that my behavior demonstrates
              a respect for beneficiaries and their families, their culture and their rights and follow
              recommendations provided.</li>
            </ul>
          </div>
          <div class="flex flex-col mb-3">
            <p class="text-sm font-semibold text-slate-700 mb-2">Unnaceptable behaviors:</p>
            <ul class="list-disc ml-4 mb-4 text-sm">
              <li class="mb-2">I will not solicit a romantic/dating relationship and will never engage in sexual/sexually suggestive
              behavior with any beneficiary, regardless of age.</li>
              <li class="mb-2">I will never engage in sexual/sexually suggestive behavior with any child under age 18, regardless of
              the legal age of consent in-country.</li>
              <li class="mb-2">I will never use language that is verbally/emotionally abusive, sexually suggestive, degrading,
              humiliating, shaming or is otherwise culturally inappropriate with a beneficiary.</li>
              <li class="mb-2">I will not touch (some examples include kissing, cuddling, picking up, holding, etc.) beneficiaries in
              an inappropriate or culturally insensitive way.</li>
              <li class="mb-2">I will never use any kind of physical discipline or physical punishment (some examples include
                whipping, caning, slapping, forcing punitive exercise, and other types of corporal punishment) as a
                method of correction for beneficiaries.</li>
              <li class="mb-2">I will never travel alone with a beneficiary, without an approved representative or prior approval,
              except in a life-threatening emergency where circumstances require immediate movement.</li>
              <li class="mb-2">I will not hire any child in any harmful form of child labor and follow local laws regarding child
              employment.</li>
              <li class="mb-2">I will never visit a beneficiary, their caregiver(s)and/or church outside the bounds of acceptable
              program or tours and visits standards.</li>
              <li class="mb-2">I will not gather, disclose or support the disclosure of information about beneficiaries or their
              families without prior, express permission that contains private or privileged content such as
              physical, mental or emotional health status, financial data, history of abuse or exploitation, or any
              portrayal that does not meet Compassion’s identified dignity standards. Additionally, I will not
              disclose information that might allow a beneficiary or their family to be physically located (such as
              a map to their home, home address, or geo-tag to their location in a photograph.) I understand that
              disclosure includes content published in any print or digital form on any public or private platform.</li>
              <li class="mb-2">I will not condone or participate in illegal, unsafe or abusive behavior of any child, including
              exploitation, trafficking, harmful traditional practices, and spiritual or ritualistic abuse.</li>
            </ul>
          </div>
        </div>
        <div t-if="store.userId" class="p-4 bg-slate-100 border-t border-solid border-slate-200 flex flex-col items-center">
          <p class="text-sm font-semibold text-slate-700 mb-2">Videos</p>
          <div class="flex flex-row space-x-4 child-protection-video">
            <Button size="'sm'" icon="'right-from-bracket'" level="'secondary'" t-on-click="watchVideo">Watch the child protection video</Button>
          </div>
        </div>
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

  store = useStore();
  setLanguage = setLanguage;
  selectedLang = selectedLang;

  languages = {
    fr_CH: { name: 'French', flag: markup(FR) },
    en_US: { name: 'English', flag: markup(GB) },
    de_DE: { name: 'German', flag: markup(DE) },
    it_IT: { name: 'Italiano', flag: markup(IT) },
  };

  watchVideo() {
    window.open(
      t_("Child Protection Video Link"),
      "_blank"
    );
  };
}

export default ChildModal;