import LetterDAO, { Letter } from "./LetterDAO";
import UserDAO, { User } from "./UserDAO";
import SettingsDAO from "./SettingsDAO";

export type {
  Letter,
  User,
};

export const models = {
  users: UserDAO,
  letters: LetterDAO,
  settings: SettingsDAO,
};