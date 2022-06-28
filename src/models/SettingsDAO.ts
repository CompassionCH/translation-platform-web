import _ from "../i18n";
import notyf from "../notifications";
import OdooAPI from "./OdooAPI";

export type Language = string;

type RawTranslationCompetence = {
  id: number;
  source_language_id: [number, string];
  dest_language_id: [number, string];
};

export type TranslationCompetence = {
  id: number;
  source: Language;
  target: Language;
};

export type IssueType = {
  id: string;
  text: string;
}

const SettingsDAO = {

  async translationCompetences(): Promise<TranslationCompetence[]> {
    const competences = await OdooAPI.execute_kw<RawTranslationCompetence[]>('translation.competence', 'search_read', [], {
      fields: ['source_language_id', 'dest_language_id'],
    });

    if (!competences) {
      console.error('Unable to retrieve translation skills');
      return [];
    }

    return competences.map(it => ({
      id: it.id,
      source: it.source_language_id[1],
      target: it.dest_language_id[1],
    }));
  },

  async languages(): Promise<Language[]> {
    const skills = await this.translationCompetences();
    const languages: string[] = skills.flatMap(it => ([it.source, it.target]));
    return [...new Set(languages)]; // Remove duplicates
  },

  async letterIssues(): Promise<IssueType[]> {
    const issues = await OdooAPI.execute_kw<[string, string][]>('correspondence', 'get_translation_issue_list', []);
    if (!issues) {
      notyf.error(_('Unable to load issues list'));
      return [];
    } else {
      return issues.map(([id, text]) => ({ id, text }));
    }
  }
}

export default SettingsDAO;