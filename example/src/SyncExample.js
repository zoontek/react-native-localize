import React from "react";
import RNLanguages from "react-native-languages";
import i18n from "i18n-js";
import memoize from "lodash.memoize";

import {
  I18nManager,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  ar: () => require("../android/app/src/main/assets/translations/ar.json"),
  en: () => require("../android/app/src/main/assets/translations/en.json"),
  fr: () => require("../android/app/src/main/assets/translations/fr.json"),
};

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

const setI18nConfig = () => {
  // most suited language
  const language = RNLanguages.languages.find(l =>
    Object.keys(translationGetters).includes(l.code),
  );

  // fallback of no available translation fits well
  const languageCode = language ? language.code : "en";
  const isRTL = language ? language.isRTL : false;
  const translation = translationGetters[languageCode]();

  // clear translation cache
  translate.cache = new memoize.Cache();

  // set i18n-js config
  i18n.translations = { [languageCode]: translation };
  i18n.locale = languageCode;

  // change layout direction
  I18nManager.forceRTL(isRTL);
};

export default class SyncExample extends React.Component {
  constructor(props) {
    super(props);
    setI18nConfig(); // set initial config
  }

  componentDidMount() {
    this.configDidChangeListener = RNLanguages.addListener(
      "configDidChange",
      () => {
        setI18nConfig();
        this.forceUpdate();
      },
    );
  }

  componentWillUnmount() {
    if (this.configDidChangeListener) {
      this.configDidChangeListener.remove();
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <Line name="Translation example" value={translate("hello")} />

          <Line name="RNLanguages.languages" value={RNLanguages.languages} />
          <Line name="RNLanguages.currencies" value={RNLanguages.currencies} />
          <Line name="RNLanguages.calendar" value={RNLanguages.calendar} />
          <Line name="RNLanguages.country" value={RNLanguages.country} />

          <Line
            name="RNLanguages.temperatureUnit"
            value={RNLanguages.temperatureUnit}
          />

          <Line name="RNLanguages.timeZone" value={RNLanguages.timeZone} />

          <Line
            name="RNLanguages.uses24HourClock"
            value={RNLanguages.uses24HourClock}
          />

          <Line
            name="RNLanguages.usesMetricSystem"
            value={RNLanguages.usesMetricSystem}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const Line = props => (
  <View style={styles.block}>
    <Text style={styles.name}>{props.name}</Text>
    <Text style={styles.value}>{JSON.stringify(props.value)}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "white",
    flex: 1,
  },
  container: {
    padding: 16,
    alignItems: "flex-start",
  },
  block: {
    marginBottom: 16,
    alignItems: "flex-start",
  },
  name: {
    textDecorationLine: "underline",
    fontWeight: "500",
    marginBottom: 8,
  },
  value: {
    textAlign: "left",
  },
});
