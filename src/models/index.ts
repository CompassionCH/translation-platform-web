import LetterDAO, { Letter } from "./LetterDAO";
import UserDAO, { User } from "./UserDAO";

export type {
  Letter,
  User,
};

export const models = {
  users: UserDAO,
  letters: LetterDAO,
};