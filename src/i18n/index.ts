import fr from './fr';

const LANG_KEY = 'translation-platform-langage';
const lang = window.localStorage.getItem(LANG_KEY);

/**
 * Keep track of errors we displayed regarding missing
 * dictionnaries to avoid overloading the console with error
 */
const errorDictShown: Record<string, boolean> = {};

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
  'french': fr,
};

/**
 * Translation function. It receives a string from Owl and attempts
 * to translate it given the lang stored in the store. If a corresponding
 * string cannot be found, it triggers an error in the console and fallbacks
 * to the given string, which should be in english.
 * @param str text to translate
 * @returns the translated string
 */
const _ = (str: string): string => {
  
  // No language set, default to english
  if (!lang) {
    return str;
  }

  if (!(lang in dictionnaries)) {
    if (errorDictShown[lang] !== true) {
      console.error(`No dictionnary found for lang ${lang}`);
      errorDictShown[lang] = true;
    }
    return str;
  }

  const dict = dictionnaries[lang as keyof typeof dictionnaries];

  if (!(str in dictionnaries)) {
    console.warn(`No translation found for [${str}]`);
    return str;
  }

  return dict[str as keyof typeof dict];
};

export default _;