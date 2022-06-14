import TranslationDAO, { Translation } from "./TranslationDAO";
import UserDAO, { User } from "./UserDAO";

export type {
  Translation,
  User,
};

export const models = {
  users: UserDAO,
  translations: TranslationDAO,
};