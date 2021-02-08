// i18n setup
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export function initI18n (locales) {
  i18n.use(LanguageDetector).init({
    resources: locales,
    fallbackLng: 'en',
    debug: false,
    ns: ['translations'],
    defaultNS: 'translations',
    interpolation: {
      escapeValue: false,
      formatSeparator: ',',
    },
    react: {
      wait: true,
    },
  });

  return i18n;
}
