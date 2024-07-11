import fr_CH from './fr_CH.json';
import de_DE from './de_DE.json';
import en_US from './en_US.json';

const LANG_KEY = 'translation-platform-langage-new';
const lang = window.localStorage.getItem(LANG_KEY);

export const selectedLang = lang || 'en_US';

/**
 * Keep track of errors we displayed regarding missing
 * dictionnaries to avoid overloading the console with error
 */
const errorDictShown: Record<string, boolean> = {};

/**
 * Keep track of all missing translations to be able to run
 * dumpMissingTranslations function from browser console
 */
const missingTranslations: string[] = [];

/**
 * Allows set the new language for the application. We store it
 * in local storage then reload the window to see changes
 * @param lang 
 */
export function setLanguage(lang: string) {
  window.localStorage.setItem(LANG_KEY, lang);
  window.location.reload();
}

/**
 * The various dictionnaries we have at our disposal
 */
const dictionnaries = {
  fr_CH,
  de_DE,
  en_US,
};

/**
 * You can call this function from the browser console to dump the
 * missing translations as a JSON object, to add to existing dictionnaries.
 */
// @ts-ignore to avoid error of adding a global function to the window object
window.dumpMissingTranslations = () => JSON.stringify(missingTranslations.reduce((acc, it) => {
  acc[it] = it;
  return acc;
}, {} as Record<string, string>));

/**
 * Translation function. It receives a string from Owl and attempts
 * to translate it given the lang stored in the store. If a corresponding
 * string cannot be found, it triggers an error in the console and fallbacks
 * to the given string, which should be in english.
 * @param str text to translate
 * @param targetLang Target language code (optional). The translation will be attempted in the target language.
 * @returns the translated string
 */
const _ = (str: string, targetLang?: string): string => {

  const effectiveLang = targetLang ? targetLang : lang;

  // No language set, default to english
  if (!effectiveLang) {
    return str;
  }

  if (!(effectiveLang in dictionnaries)) {
    if (errorDictShown[effectiveLang] !== true) {
      console.error(`No dictionnary found for language ${effectiveLang}`);
      errorDictShown[effectiveLang] = true;
    }
    return str;
  }

  const dict = dictionnaries[effectiveLang as keyof typeof dictionnaries];

  if (!(str in dict)) {
    console.warn(`No translation found for [${str}]`);
    missingTranslations.push(str);
    return str;
  }

  return dict[str as keyof typeof dict];
};

export default _;

