import { Component, useState, xml } from "@odoo/owl";
import Button from "./Button";
import { models } from "../models";
import notyf from "../notifications";
import _ from "../i18n";

class TranslationSkills extends Component {
  static template = xml`
    <div t-foreach="props.skills" t-as="skill" t-key="skill_index" class="flex items-center mb-3">
      <div class="mr-2">
        <Button onClick="() => this.deleteTranslatorSkill(skill)" color="'red'" circle="true" size="'sm'">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </Button>
      </div>
      <p t-esc="_(skill.source)" class="text-sm text-slate-700 bg-slate-100 rounded-sm py-2 font-semibold w-28 text-center" />
      <p class="text-slate-500 font-semibold text-sm mx-4">-></p>
      <p t-esc="_(skill.target)" class="text-sm text-slate-700 bg-slate-100 rounded-sm py-2 font-semibold w-28 text-center" />
    </div>
  `;

  static components = {
    Button
  };

  _ = _;

  state = useState({
    loading: false,
  });

  static props = {
      translatorId : {type: Number},
      ['skills']: {  },
      onChange: { type: Function },
  };

  async deleteTranslatorSkill(skill: number) {

    this.state.loading = true;

    const isSkillDeleted = await models.translators.deleteSkill(this.props.translatorId, skill);
    
    this.state.loading = false;

    if (isSkillDeleted) {
      notyf.success(_('Your skill has been successfully deleted'));
      this.props.onChange();
    } else {
      notyf.error(_("Your skill couldn't be successfully deleted"));
    }
  };
}

export default TranslationSkills;