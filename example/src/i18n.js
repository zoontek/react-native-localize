import RNLanguages from 'react-native-languages';
import i18n from 'i18n-js';

import en from './translations/en.json';
import fr from './translations/fr.json';
import de from './translations/de.json';

i18n.locale = RNLanguages.language;
i18n.fallbacks = true;
i18n.translations = { en, fr, de };

export default i18n;
