import { Component, useState, xml } from "@odoo/owl";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import TranslationSkills from "../../components/TranslationSkills";
import useLanguages from "../../hooks/useLanguages";
import _ from "../../i18n";
import { models } from "../../models";
import { TranslationCompetence } from "../../models/SettingsDAO";
import { Translator } from "../../models/TranslatorDAO";
import notyf from "../../notifications";

class LanguagePickModal extends Component {

  static template = xml`
    <Modal active="props.active" loading="languages.loading or state.loading" onClose="props.onClose" title="'Languages'" subtitle="'Your translation skills'" closeButtonText="'Cancel'">
      <div t-if="state.translator" t-att-class="{
        'w-192 grid grid-cols-2': state.translator.skills.length gt 0,
        'w-96': state.translator.skills.length === 0
      }">
        <div class="p-4 flex flex-col items-center" t-if="state.translator.skills.length gt 0">
          <h4 class="font-medium text-slate-700 mb-2">Your current translation skills</h4>
          <TranslationSkills skills="state.translator.skills" />
        </div>
        <div class="p-4 bg-slate-100 flex flex-col items-center">
          <h4 class="font-medium text-slate-700 mb-2">Register a new translation skill</h4>
          <p class="text-sm text-center text-slate-700 mb-4">Please note that translating from a language to another and back is considered two different skills</p>
          <div t-foreach="state.potentialSkills" t-as="skill" t-key="skill_index" class="flex w-full items-center ring ring-slate-300 rounded-sm mb-4">
            <select class="compassion-input text-sm" t-model="skill.competenceId">
              <option t-foreach="state.competences" t-as="competence" t-key="competence.id" t-att-value="competence.id" t-esc="_(competence.source) + ' -> ' + _(competence.target)" t-att-disabled="translatorHasSkill(competence)" />
            </select>
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
    competences: [] as TranslationCompetence[],
    potentialSkills: [] as { competenceId: number }[],
    allowedCompetences: [] as TranslationCompetence[],
    translator: undefined as Translator | undefined,
    loading: false,
  });

  static props = {
    active: { type: Boolean },
    onClose: { type: Function },
    onChange: { type: Function },
    translatorId: { type: Number },
  }

  translatorHasSkill(competence: TranslationCompetence) {
    return this.state.translator?.skills.find((it) => it.source === competence.source && it.target === competence.target) !== undefined;
  }

  setup(): void {
    this.state.loading = true;

    Promise.all([
      models.settings.translationCompetences(),
      models.translators.find(this.props.translatorId),
    ]).then((res) => {
      if (!res[1]) {
        notyf.error(_('Unable to load translator information'));
        this.props.onClose();
        this.state.loading = false;
      }

      this.state.competences = res[0];
      this.state.translator = res[1];
      this.state.allowedCompetences = res[0].filter(it => !this.translatorHasSkill(it));
      this.state.loading = false;
    });
  }

  addSkill() {
    this.state.potentialSkills.push({ competenceId: this.state.allowedCompetences[0].id });
  }

  async registerSkills() {
    this.state.loading = true;
    const res = await models.translators.registerSkills(this.props.translatorId, this.state.potentialSkills.map(it => parseInt(it.competenceId as any, 10)));
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