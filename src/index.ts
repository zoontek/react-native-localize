import { getLocales } from "./module";

export function findBestLanguageTag<T extends string>(
  languageTags: ReadonlyArray<T>,
): { languageTag: T; isRTL: boolean } | undefined {
  const locales = getLocales();
  const loweredLanguageTags = languageTags.map((tag) => tag.toLowerCase());

  for (let i = 0; i < locales.length; i++) {
    const currentLocale = locales[i];

    if (!currentLocale) {
      continue;
    }

    const { languageTag, languageCode, scriptCode, countryCode, isRTL } =
      currentLocale;

    const combinaisons = [
      languageTag,
      !!scriptCode ? languageCode + "-" + scriptCode : null,
      languageCode + "-" + countryCode,
      languageCode,
    ].filter((value): value is string => !!value);

    for (let j = 0; j < combinaisons.length; j++) {
      const combinaison = combinaisons[j]?.toLowerCase();

      if (!combinaison) {
        continue;
      }

      const tagIndex = loweredLanguageTags.indexOf(combinaison);
      const languageTag = languageTags[tagIndex];

      if (languageTag && tagIndex !== -1) {
        return { languageTag, isRTL };
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
  openAppLanguageSettings,
  uses24HourClock,
  usesAutoDateAndTime,
  usesAutoTimeZone,
  usesMetricSystem,
} from "./module";
export * from "./types";
