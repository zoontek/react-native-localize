// @flow

import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View } from 'react-native';
import ReactNativeLanguages from 'react-native-languages';

type State = {
  language: string,
  languages: Array<string>
};

export default class ReactNativeLanguagesExample extends Component {
  state: State = {
    language: ReactNativeLanguages.language,
    languages: ReactNativeLanguages.languages
  };

  _onLanguagesChange = ({ language, languages }) => {
    this.setState({ language, languages });
  };

  componentDidMount() {
    ReactNativeLanguages.addEventListener('change', this._onLanguagesChange);
  }

  componentWillUnmount() {
    ReactNativeLanguages.removeEventListener('change', this._onLanguagesChange);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>react-native-languages demo</Text>
        <Text style={styles.line}>
          langague: {ReactNativeLanguages.language}
        </Text>
        <Text style={styles.line}>
          langagues: {JSON.stringify(ReactNativeLanguages.languages)}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    paddingHorizontal: 10,
    paddingVertical: 30
  },
  title: {
    fontSize: 20,
    marginBottom: 10
  },
  line: {
    color: '#333333',
    marginBottom: 5
  }
});

AppRegistry.registerComponent(
  'ReactNativeLanguagesExample',
  () => ReactNativeLanguagesExample
);
