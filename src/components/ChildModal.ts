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
              <li class="mb-2">I will demonstrate appropriate respect and dignity towards all children, and I will show Jesus' love and care for them, regardless of their gender, age, race, religion, social background, culture, social needs, or disabilities.</li>
              <li class="mb-2">I will respond to appropriate and reasonable expectations for children based on their age and level of maturity. (For example, it is normal, in terms of development, for a three-year-old to become easily upset when tired, but one can expect a teenager to control their emotions even when very tired.)</li>
              <li class="mb-2">I will communicate with children in a way that is appropriate for their age.</li>
              <li class="mb-2">I will only participate in activities with children in open and visible places, and in the event that an activity needs to be practiced in an enclosed space, I will ensure that at least one representative from Compassion is present.</li>
              <li class="mb-2">If I witness abuse of a child, if I know that a child is in danger, if I notice concerning behavior from colleagues, partners, or other representatives, or if a child approaches me to report abuse, I will take it seriously and report it to the relevant personnel or authorities. I will seek to do everything in my power to ensure that the child is out of harm's way.</li>
              <li class="mb-2">I will maintain the confidentiality of all information related to child protection investigations, keeping in mind everyone's concerns regarding privacy and dignity.</li>
              <li class="mb-2">If necessary, I will comply with child protection investigations and provide all necessary documents or information for the proper conduct of the investigation.</li>
              <li class="mb-2">I will contribute to creating an environment where children are respected and encouraged to speak up about their concerns and rights.</li>
              <li class="mb-2">I will respect Compassion's rules regarding communication with children, including interactions through social media.</li>
              <li class="mb-2">I will adhere to the standards of dignity (for example, I will only photograph or film children who are dressed appropriately, who understand that they are being filmed, etc.) in photography and videography.</li>
              <li class="mb-2">I will take care of my appearance, language, and actions to ensure that my behavior reflects my respect for children and their families, their culture, and their rights, and complies with the provided recommendations.</li>
            </ul>
          </div>
          <div class="flex flex-col mb-3">
            <p class="text-sm font-semibold text-slate-700 mb-2">Unnaceptable behaviors:</p>
            <ul class="list-disc ml-4 mb-4 text-sm">
              <li class="mb-2">I will not solicit any romantic/intimate relationship and will never engage in sexual/sexually suggestive behavior with a child, regardless of their age.</li>
              <li class="mb-2">I will never engage in sexual/sexually suggestive behavior with a child under the age of 18, regardless of the age of majority in this country.</li>
              <li class="mb-2">I will never speak in a verbally/emotionally abusive, sexually suggestive, degrading, humiliating, stigmatizing, or culturally inappropriate manner with a child.</li>
              <li class="mb-2">I will not touch (such as kissing, hugging, lifting, holding, etc.) children in an inappropriate or culturally insensitive manner.</li>
              <li class="mb-2">I will never resort to any type of physical punishment or corporal punishment (such as whipping, caning, slapping, punitive physical exercises, and other types of corporal punishment) as a disciplinary method for children.</li>
              <li class="mb-2">I will never travel alone with a child without an approved representative or prior approval, except in cases of vital emergency where circumstances require immediate travel.</li>
              <li class="mb-2">I will not employ any child in any form of child labor and will respect local laws regarding the employment of children.</li>
              <li class="mb-2">I will never visit a child, their parent/guardian, and/or their church outside of acceptable program standards regarding visits or tours.</li>
              <li class="mb-2">I will not collect, disclose, or assist in the disclosure, without prior express permission, of information about children or their families containing private or confidential information such as physical, mental, or emotional health status, financial data, history of abuse or exploitation, or any representation that is not in accordance with the dignity standards identified by Compassion. Additionally, I will not disclose information that could allow for the geographic location of a child or their family to be identified (such as a map indicating the location of their home, the address of their home, or a geolocation tag of their home contained in a photo). I understand that disclosure also applies to content published in paper or digital form, on any public or private platform.</li>
              <li class="mb-2">I will not authorize or participate in any illegal, dangerous, or abusive behavior towards any child, whether it involves exploitation, trafficking, harmful traditional practices, or spiritual or ritual abuse.</li>
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
      t_("#"),
      "_blank"
    );
  };
}

export default ChildModal;