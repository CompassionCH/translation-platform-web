import LetterDAO, { Letter } from "./LetterDAO";
import TranslatorDAO, { Translator } from "./TranslatorDAO";
import SettingsDAO from "./SettingsDAO";
import LeaderboardDAO from "./LeaderboardDAO";

export type {
  Letter,
  Translator,
};

export const models = {
  translators: TranslatorDAO,
  letters: LetterDAO,
  settings: SettingsDAO,
  leaderboards: LeaderboardDAO,
};