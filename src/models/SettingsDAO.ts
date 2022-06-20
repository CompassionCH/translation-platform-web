
export type Language = string;

const languages = ['french', 'english', 'spanish', 'chinese', 'german'];
export const randomLanguage = () => languages[Math.floor(Math.random() * languages.length)];

const SettingsDAO = {

  languages: async () => {
    return new Promise<Language[]>((resolve) => {
      setTimeout(() => resolve(languages), 500);
    });
  },
}

export default SettingsDAO;