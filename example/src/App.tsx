import { createIntl, createIntlCache } from "@formatjs/intl";
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

const translations = {
  ar: require("./translations/ar.json"),
  en: require("./translations/en.json"),
  fr: require("./translations/fr.json"),
} as const;

type Translation = keyof typeof translations;

// fallback if no available language fits
const fallback = { languageTag: "en", isRTL: false };

const { languageTag, isRTL } =
  RNLocalize.findBestLanguageTag(Object.keys(translations)) ?? fallback;

// update layout direction
I18nManager.forceRTL(isRTL);

const intl = createIntl(
  {
    defaultLocale: "en",
    locale: languageTag,
    messages: translations[languageTag as Translation],
  },
  createIntlCache(),
);

type TranslationParams = Parameters<(typeof intl)["formatMessage"]>[1];

const translate = (key: string, params?: TranslationParams) =>
  intl
    .formatMessage({ id: key, defaultMessage: translations["en"][key] }, params)
    .toString();

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
    color: "black",
  },
  value: {
    textAlign: "left",
    color: "black",
  },
});

const Line = ({ name, value }: { name: string; value: unknown }) => (
  <View style={styles.block}>
    <Text style={styles.name}>{name}</Text>
    <Text style={styles.value}>{JSON.stringify(value, null, 2)}</Text>
  </View>
);

export const App = () => (
  <SafeAreaView style={styles.safeArea}>
    <ScrollView contentContainerStyle={styles.container}>
      <Line name="RNLocalize.getLocales()" value={RNLocalize.getLocales()} />

      <Line
        name="RNLocalize.getCurrencies()"
        value={RNLocalize.getCurrencies()}
      />

      <Line name="RNLocalize.getCountry()" value={RNLocalize.getCountry()} />

      <Line name="RNLocalize.getCalendar()" value={RNLocalize.getCalendar()} />

      <Line
        name="RNLocalize.getNumberFormatSettings()"
        value={RNLocalize.getNumberFormatSettings()}
      />

      <Line
        name="RNLocalize.getTemperatureUnit()"
        value={RNLocalize.getTemperatureUnit()}
      />

      <Line name="RNLocalize.getTimeZone()" value={RNLocalize.getTimeZone()} />

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
        name="RNLocalize.findBestLanguageTag(['en-US', 'en', 'fr'])"
        value={RNLocalize.findBestLanguageTag(["en-US", "en", "fr"])}
      />

      <Line name="Translation example" value={translate("hello")} />
    </ScrollView>
  </SafeAreaView>
);
