import {
  getCalendar,
  getCountry,
  getCurrencies,
  getLocales,
  getNumberFormatSettings,
  getTemperatureUnit,
  getTimeZone,
  uses24HourClock,
  usesAutoDateAndTime,
  usesAutoTimeZone,
  usesMetricSystem,
} from "./module";

export function findBestAvailableLanguage<T extends string>(
  languageTags: ReadonlyArray<T>,
): { languageTag: T; isRTL: boolean } | undefined {
  const locales = getLocales();
  const loweredLanguageTags = languageTags.map((tag) => tag.toLowerCase());

  for (let i = 0; i < locales.length; i++) {
    const currentLocale = locales[i];

    const { languageTag, languageCode, scriptCode, countryCode, isRTL } =
      currentLocale;

    const combinaisons = [
      languageTag,
      !!scriptCode ? languageCode + "-" + scriptCode : null,
      languageCode + "-" + countryCode,
      languageCode,
    ].filter((value): value is string => !!value);

    for (let j = 0; j < combinaisons.length; j++) {
      const combinaison = combinaisons[j].toLowerCase();
      const tagIndex = loweredLanguageTags.indexOf(combinaison);

      if (tagIndex !== -1) {
        return { languageTag: languageTags[tagIndex], isRTL };
      }
    }
  }
}

export {
  getCalendar,
  getCountry,
  getCurrencies,
  getLocales,
  getNumberFormatSettings,
  getTemperatureUnit,
  getTimeZone,
  uses24HourClock,
  usesAutoDateAndTime,
  usesAutoTimeZone,
  usesMetricSystem,
} from "./module";
export * from "./types";

export default {
  getCalendar,
  getCountry,
  getCurrencies,
  getLocales,
  getNumberFormatSettings,
  getTemperatureUnit,
  getTimeZone,
  uses24HourClock,
  usesAutoDateAndTime,
  usesAutoTimeZone,
  usesMetricSystem,

  findBestAvailableLanguage,
};
