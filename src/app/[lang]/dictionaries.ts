import 'server-only';

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  es: () => import('./dictionaries/es.json').then((module) => module.default),
};

export type Locale = keyof typeof dictionaries;

const isValidLocale = (locale: string): locale is Locale => {
  return locale in dictionaries;
};

export const getDictionary = async (locale: string) => {
  const validLocale = isValidLocale(locale) ? locale : 'en';
  return dictionaries[validLocale]();
};
