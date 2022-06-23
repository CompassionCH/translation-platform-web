import LetterDAO, { Letter } from "./LetterDAO";
import TranslatorDAO, { Translator } from "./TranslatorDAO";
import SettingsDAO from "./SettingsDAO";

export type {
  Letter,
  Translator,
};

export const models = {
  translators: TranslatorDAO,
  letters: LetterDAO,
  settings: SettingsDAO,
};