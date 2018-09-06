import React, { Component } from 'react';
import RNLanguages from 'react-native-languages';
import i18n from './i18n';
import Root from './Root';

export default class App extends Component {
  componentWillMount() {
    RNLanguages.addEventListener('change', this._onLanguagesChange);
  }

  componentWillUnmount() {
    RNLanguages.removeEventListener('change', this._onLanguagesChange);
  }

  _onLanguagesChange = ({ language }) => {
    i18n.locale = language;
  };

  render() {
    return <Root />;
  }
}
