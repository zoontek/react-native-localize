import React, { PureComponent } from 'react';
import RNLanguages from 'react-native-languages';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import Root from './Root';

export default class App extends PureComponent {
  componentWillMount() {
    RNLanguages.addEventListener('change', this._onLanguagesChange);
  }

  componentWillUnmount() {
    RNLanguages.removeEventListener('change', this._onLanguagesChange);
  }

  _onLanguagesChange = ({ language }) => {
    i18n.changeLanguage(language);
  };

  render() {
    return (
      <I18nextProvider i18n={i18n}>
        <Root />
      </I18nextProvider>
    );
  }
}
