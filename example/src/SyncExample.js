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
import * as RNLocalize from "react-native-localize";

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
  // fallback if no available language fits
  const fallback = { languageTag: "en", isRTL: false };

  const { languageTag, isRTL } =
    RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
    fallback;

  // clear translation cache
  translate.cache.clear();
  // update layout direction
  I18nManager.forceRTL(isRTL);

  // set i18n-js config
  i18n.translations = { [languageTag]: translationGetters[languageTag]() };
  i18n.locale = languageTag;
};

export default class SyncExample extends React.Component {
  constructor(props) {
    super(props);
    setI18nConfig(); // set initial config
  }

  componentDidMount() {
    RNLocalize.addEventListener("change", this.handleLocalizationChange);
  }

  componentWillUnmount() {
    RNLocalize.removeEventListener("change", this.handleLocalizationChange);
  }

  handleLocalizationChange = () => {
    setI18nConfig();
    this.forceUpdate();
  };

  render() {
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
    <Text style={styles.value}>{JSON.stringify(props.value, null, 2)}</Text>
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
