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
    <Modal active="props.active" title="'Child Protection'" onClose="props.onClose">
      <div class="w-256">
        <div class="p-4">
          <div class="flex flex-col mb-3">
            <p class="text-sm font-semibold text-slate-700 mb-2">Here will be some text about the Child Protection part</p>
            <p class="text-sm text-slate-700 mb-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ornare egestas eros in ultricies. 
              Pellentesque vel nulla urna. Morbi placerat ac purus vel pretium. Nam ornare, dolor lacinia accumsan tempus, 
              sem orci posuere leo, non maximus libero quam vel ante. Sed tempus magna at ipsum dapibus, eu gravida elit aliquet. 
              Proin porttitor, nulla a lacinia facilisis, massa lectus volutpat nibh, eu aliquet mi ex ac urna. Nunc vehicula mauris vitae purus dapibus sagittis.
              Etiam aliquet nunc libero, a dapibus odio rutrum vel. Donec luctus pharetra lacus, ut dictum tellus fermentum a. Quisque ultrices sem ut dapibus vestibulum.
              Duis pharetra non massa ut egestas. Donec faucibus nec neque non tristique. Cras vitae justo purus. In lacinia est nec maximus finibus.
              Sed hendrerit nisi non sem scelerisque, vel aliquet tellus mollis. 
            </p>
          </div>
          <p class="text-sm font-semibold text-slate-700 mb-2">Translation charter</p>
          <ul class="list-disc ml-4 mb-4 text-sm">
            <li class="mb-2">I agree not to disclose the information contained in the letter to be translated.</li>
            <li class="mb-2">I agree to submit a translation as soon as possible.</li>
            <li class="mb-2">I commit myself, through my translation, to respect the original message of the text as much as possible.</li>
          </ul>
        </div>
        <div t-if="store.userId" class="p-4 bg-slate-100 border-t border-solid border-slate-200 flex flex-col items-center">
          <p class="text-sm font-semibold text-slate-700 mb-2">Videos</p>
          <div class="flex flex-row space-x-4">
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