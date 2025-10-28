import { createIntl, createIntlCache } from "@formatjs/intl";
import {
  Button,
  I18nManager,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  findBestLanguageTag,
  getCalendar,
  getCountry,
  getCurrencies,
  getLocales,
  getNumberFormatSettings,
  getTemperatureUnit,
  getTimeZone,
  openAppLanguageSettings,
  uses24HourClock,
  usesAutoDateAndTime,
  usesAutoTimeZone,
  usesMetricSystem,
} from "react-native-localize";
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
  findBestLanguageTag(Object.keys(translations)) ?? fallback;

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
      <Line name="getCalendar()" value={getCalendar()} />
      <Line name="getCountry()" value={getCountry()} />
      <Line name="getCurrencies()" value={getCurrencies()} />
      <Line name="getLocales()" value={getLocales()} />

      <Line
        name="getNumberFormatSettings()"
        value={getNumberFormatSettings()}
      />

      <Line name="getTemperatureUnit()" value={getTemperatureUnit()} />
      <Line name="getTimeZone()" value={getTimeZone()} />
      <Line name="uses24HourClock()" value={uses24HourClock()} />
      <Line name="usesMetricSystem()" value={usesMetricSystem()} />

      {Platform.OS === "android" && (
        <>
          <Line name="usesAutoDateAndTime()" value={usesAutoDateAndTime()} />
          <Line name="usesAutoTimeZone()" value={usesAutoTimeZone()} />
        </>
      )}

      <Line
        name="findBestLanguageTag(['en-US', 'en', 'fr'])"
        value={findBestLanguageTag(["en-US", "en", "fr"])}
      />

      <Line name="Translation example" value={translate("hello")} />

      {Platform.OS === "android" && Platform.Version >= 33 && (
        <Button
          title="Open app language settings"
          onPress={() => {
            openAppLanguageSettings().catch((error) => {
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
