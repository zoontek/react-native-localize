import { createIntl, createIntlCache } from "@formatjs/intl";
import * as React from "react";
import {
  Button,
  I18nManager,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Localize from "react-native-localize";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const translations = {
  ar: require("./translations/ar.json"),
  en: require("./translations/en.json"),
  fr: require("./translations/fr.json"),
} as const;

type Translation = keyof typeof translations;

// fallback if no available language fits
const fallback = { languageTag: "en", isRTL: false };

const { languageTag, isRTL } =
  Localize.findBestLanguageTag(Object.keys(translations)) ?? fallback;

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
  base: {
    backgroundColor: "white",
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

const AppContent = () => {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={[
        styles.base,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <Line name="Localize.getLocales()" value={Localize.getLocales()} />

      <Line name="Localize.getCurrencies()" value={Localize.getCurrencies()} />

      <Line name="Localize.getCountry()" value={Localize.getCountry()} />

      <Line name="Localize.getCalendar()" value={Localize.getCalendar()} />

      <Line
        name="Localize.getNumberFormatSettings()"
        value={Localize.getNumberFormatSettings()}
      />

      <Line
        name="Localize.getTemperatureUnit()"
        value={Localize.getTemperatureUnit()}
      />

      <Line name="Localize.getTimeZone()" value={Localize.getTimeZone()} />

      <Line
        name="Localize.uses24HourClock()"
        value={Localize.uses24HourClock()}
      />

      <Line
        name="Localize.usesMetricSystem()"
        value={Localize.usesMetricSystem()}
      />

      {Platform.OS === "android" && (
        <>
          <Line
            name="Localize.usesAutoDateAndTime()"
            value={Localize.usesAutoDateAndTime()}
          />

          <Line
            name="Localize.usesAutoTimeZone()"
            value={Localize.usesAutoTimeZone()}
          />
        </>
      )}

      <Line
        name="Localize.findBestLanguageTag(['en-US', 'en', 'fr'])"
        value={Localize.findBestLanguageTag(["en-US", "en", "fr"])}
      />

      <Line name="Translation example" value={translate("hello")} />

      {Platform.OS === "android" && Platform.Version >= 33 && (
        <Button
          title="Open app language settings"
          onPress={() => {
            Localize.openAppLanguageSettings().catch((error) => {
              console.error(error);
            });
          }}
        />
      )}
    </ScrollView>
  );
};

export const App = () => (
  <SafeAreaProvider>
    <AppContent />
  </SafeAreaProvider>
);
