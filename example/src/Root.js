import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import i18n from './i18n';

class Root extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{i18n.t('title')}</Text>

        <Text style={styles.line}>
          {i18n.t('current', { language: i18n.currentLocale() })}
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

export default Root;
