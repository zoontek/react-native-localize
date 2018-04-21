import React, { PureComponent } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { translate } from 'react-i18next';

class Root extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{this.props.t('title')}</Text>

        <Text style={styles.line}>
          {this.props.t('current', {
            language: this.props.i18n.language
          })}
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

export default translate('common')(Root);
