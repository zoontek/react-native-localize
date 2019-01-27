import React from "react";
import RNLanguages from "react-native-languages";
import RNFS from "react-native-fs";
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

const setI18nConfig = async () => {
  const isAndroid = Platform.OS === "android";

  const translationsDir = await (isAndroid
    ? RNFS.readDirAssets("translations")
    : RNFS.readDir(RNFS.MainBundlePath + "/translations"));

  const paths = translationsDir
    .filter(entry => entry.isFile() && entry.name.endsWith(".json"))
    .reduce(
      (acc, file) => ({
        ...acc,
        [file.name.replace(".json", "")]: file.path,
      }),
      {},
    );

  // most suited language
  const language = RNLanguages.languages.find(t =>
    Object.keys(paths).includes(t.code),
  );

  // fallback of no available translation fit well
  const languageCode = language ? language.code : "en";
  const isRTL = language ? language.isRTL : false;

  const content = await (isAndroid
    ? RNFS.readFileAssets(paths[languageCode], "utf8")
    : RNFS.readFile(paths[languageCode], "utf8"));

  const translation = JSON.parse(content);

  // clear translation cache
  translate.cache = new memoize.Cache();

  // set i18n-js config
  i18n.translations = { [languageCode]: translation };
  i18n.locale = languageCode;

  // change layout direction
  I18nManager.forceRTL(isRTL);
};

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

export default class AsyncExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isInit: false,
    };

    setI18nConfig()
      .then(() => {
        this.setState({ isInit: true });
        this.listenForConfigChanges();
      })
      .catch(({ message }) => {
        console.error(message);
      });
  }

  listenForConfigChanges = () => {
    this.configDidChangeListener = RNLanguages.addListener(
      "configDidChange",
      () => {
        setI18nConfig()
          .then(() => this.forceUpdate())
          .catch(({ message }) => {
            console.error(message);
          });
      },
    );
  };

  componentWillUnmount() {
    if (this.configDidChangeListener) {
      this.configDidChangeListener.remove();
    }
  }

  render() {
    if (!this.state.isInit) {
      return <SafeAreaView style={styles.safeArea} />;
    }

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
