// @flow

import React, { PureComponent } from 'react';
import Languages from 'react-native-languages';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import Root from './Root';

export default class App extends PureComponent {
  componentWillMount() {
    Languages.addEventListener('change', this._onLanguagesChange);
  }

  componentWillUnmount() {
    Languages.removeEventListener('change', this._onLanguagesChange);
  }

  _onLanguagesChange = ({ language, languages }) => {
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
