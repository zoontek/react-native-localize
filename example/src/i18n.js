// @flow

import ReactNativeLanguages from 'react-native-languages';
import i18n from 'i18next';

import en from './translations/en.json';
import fr from './translations/fr.json';
import de from './translations/de.json';

export default i18n.init({
  debug: __DEV__,
  lng: ReactNativeLanguages.language,
  fallbackLng: 'en',
  ns: ['common'],
  defaultNS: 'common',
  resources: { en, fr, de },
  interpolation: { escapeValue: false }, // not needed for react
  react: { wait: true }
});
