import { Component, xml } from "@odoo/owl";

class TranslationSkills extends Component {
  static template = xml`
    <div t-foreach="props.skills" t-as="skill" t-key="skill_index" class="flex items-center mb-3">
      <p t-esc="skill.source" class="text-sm text-slate-700 bg-slate-100 rounded-sm py-2 font-semibold w-28 text-center" />
      <p class="text-slate-500 font-semibold text-sm mx-4">-></p>
      <p t-esc="skill.target" class="text-sm text-slate-700 bg-slate-100 rounded-sm py-2 font-semibold w-28 text-center" />
    </div>
  `;

  static props = ['skills'];
}

export default TranslationSkills;