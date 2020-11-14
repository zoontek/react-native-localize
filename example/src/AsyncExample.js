import i18n from "i18n-js";
import memoize from "lodash.memoize";
import * as React from "react";
import {
  I18nManager,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import RNFS from "react-native-fs";
import * as RNLocalize from "react-native-localize";

const setI18nConfig = async () => {
  const translationsDir = await (Platform.OS === "android"
    ? RNFS.readDirAssets("translations")
    : RNFS.readDir(RNFS.MainBundlePath + "/translations"));

  const translationPaths = translationsDir
    .filter(({ isFile, name }) => isFile() && name.endsWith(".json"))
    .reduce((all, { name, path }) => {
      const languageTag = name.replace(".json", "");
      return { ...all, [languageTag]: path };
    }, {});

  // fallback if no available language fits
  const fallback = { languageTag: "en", isRTL: false };

  const { languageTag, isRTL } =
    RNLocalize.findBestAvailableLanguage(Object.keys(translationPaths)) ||
    fallback;

  const fileContent = await (Platform.OS === "android"
    ? RNFS.readFileAssets(translationPaths[languageTag], "utf8")
    : RNFS.readFile(translationPaths[languageTag], "utf8"));

  // clear translation cache
  translate.cache.clear();
  // update layout direction
  I18nManager.forceRTL(isRTL);

  // set i18n-js config
  i18n.translations = { [languageTag]: JSON.parse(fileContent) };
  i18n.locale = languageTag;
};

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

export default class AsyncExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isTranslationLoaded: false,
    };

    setI18nConfig() // set initial config
      .then(() => {
        this.setState({ isTranslationLoaded: true });
        RNLocalize.addEventListener("change", this.handleLocalizationChange);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  componentWillUnmount() {
    RNLocalize.removeEventListener("change", this.handleLocalizationChange);
  }

  handleLocalizationChange = () => {
    setI18nConfig()
      .then(() => this.forceUpdate())
      .catch((error) => {
        console.error(error);
      });
  };

  render() {
    if (!this.state.isTranslationLoaded) {
      return <SafeAreaView style={styles.safeArea} />;
    }

    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <Line
            name="RNLocalize.getLocales()"
            value={RNLocalize.getLocales()}
          />
          <Line
            name="RNLocalize.getCurrencies()"
            value={RNLocalize.getCurrencies()}
          />
          <Line
            name="RNLocalize.getCountry()"
            value={RNLocalize.getCountry()}
          />
          <Line
            name="RNLocalize.getCalendar()"
            value={RNLocalize.getCalendar()}
          />
          <Line
            name="RNLocalize.getNumberFormatSettings()"
            value={RNLocalize.getNumberFormatSettings()}
          />
          <Line
            name="RNLocalize.getTemperatureUnit()"
            value={RNLocalize.getTemperatureUnit()}
          />
          <Line
            name="RNLocalize.getTimeZone()"
            value={RNLocalize.getTimeZone()}
          />
          <Line
            name="RNLocalize.uses24HourClock()"
            value={RNLocalize.uses24HourClock()}
          />
          <Line
            name="RNLocalize.usesMetricSystem()"
            value={RNLocalize.usesMetricSystem()}
          />

          {Platform.OS === "android" && (
            <>
              <Line
                name="RNLocalize.usesAutoDateAndTime()"
                value={RNLocalize.usesAutoDateAndTime()}
              />
              <Line
                name="RNLocalize.usesAutoTimeZone()"
                value={RNLocalize.usesAutoTimeZone()}
              />
            </>
          )}

          <Line
            name="RNLocalize.findBestAvailableLanguage(['en-US', 'en', 'fr'])"
            value={RNLocalize.findBestAvailableLanguage(["en-US", "en", "fr"])}
          />

          <Line name="Translation example" value={translate("hello")} />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const Line = (props) => (
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
