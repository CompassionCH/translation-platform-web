import { Component, useState, xml } from "@odoo/owl";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import TranslationSkills from "../../components/TranslationSkills";
import useLanguages from "../../hooks/useLanguages";
import _ from "../../i18n";
import { models } from "../../models";
import { TranslationSkill, User } from "../../models/UserDAO";
import notyf from "../../notifications";

class LanguagePickModal extends Component {

  static template = xml`
    <Modal active="props.active" loading="languages.loading or state.loading" onClose="props.onClose" title="'Languages'" subtitle="'Your translation skills'" closeButtonText="'Cancel'">
      <div t-if="state.user" t-att-class="{
        'w-192 grid grid-cols-2': state.user.skills.length gt 0,
        'w-96': state.user.skills.length === 0
      }">
        <div class="p-4 flex flex-col items-center" t-if="state.user.skills.length gt 0">
          <h4 class="font-medium text-slate-700 mb-2">Your current translation skills</h4>
          <TranslationSkills skills="state.user.skills" />
        </div>
        <div class="p-4 bg-slate-100 flex flex-col items-center">
          <h4 class="font-medium text-slate-700 mb-2">Register a new translation skill</h4>
          <p class="text-sm text-center text-slate-700 mb-4">Please note that translating from a language to another and back is considered two different skills</p>
          <div t-foreach="state.potentialSkills" t-as="skill" t-key="skill_index" class="flex items-center ring ring-slate-300 rounded-sm mb-4">
            <div class="w-28">
              <select class="compassion-input text-sm" t-model="skill.source">
                <option t-foreach="languages.data" t-as="lang" t-key="lang" t-att-value="lang" t-esc="_(lang)" />
              </select>
            </div>
            <p class="text-slate-500 font-semibold text-sm mx-4">-></p>
            <div class="w-28">
              <select class="compassion-input text-sm" t-model="skill.target">
                <option t-foreach="languages.data" t-as="lang" t-key="lang" t-att-value="lang" t-esc="_(lang)" />
              </select>
            </div>
            <Button square="true" level="'secondary'" icon="'trash'" onClick="() => this.state.potentialSkills.splice(skill_index, 1)" />
          </div>
          <div class="flex justify-center">
            <Button onClick="() => this.addSkill()" level="'secondary'" size="'sm'">Add Skill</Button>
          </div>
        </div>
      </div>
      <div t-else="" class="w-96 h-40" />
      <t t-set-slot="footer-buttons">
        <Button onClick="() => this.registerSkills()" disabled="state.potentialSkills.length === 0" color="'compassion'" size="'sm'">Register <span t-esc="state.potentialSkills.length" /> new Skill<span t-esc="state.potentialSkills.length === 1 ? '' : 's'" /></Button>
      </t>
    </Modal>
  `;

  static components = {
    Modal,
    Button,
    TranslationSkills,
  };

  _ = _;

  languages = useLanguages();
  state = useState({
    potentialSkills: [] as Partial<TranslationSkill>[],
    user: undefined as User | undefined,
    loading: false,
  });

  static props = {
    active: { type: Boolean },
    onClose: { type: Function },
    onChange: { type: Function },
    username: { type: String },
  }

  setup(): void {
    this.state.loading = true;
    models.users.find(this.props.username).then((user) => {
      this.state.user = user;
      this.state.loading = false;
    });
  }

  addSkill() {
    this.state.potentialSkills.push({
      source: this.languages.data[0],
      target: this.languages.data[1],
    });
  }

  async registerSkills() {
    this.state.loading = true;
    const res = await models.users.registerSkills(this.props.username, this.state.potentialSkills.map(it => ({
      ...it,
      verified: false,
    } as TranslationSkill)));
    this.state.loading = false;
    if (!res) {
      notyf.error(_('Unable to register translation skills'));
    } else {
      notyf.success(_('Your new skills have been registered'));
      this.props.onChange();
    }
  }
}

export default LanguagePickModal;