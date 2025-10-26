import { getLocales } from "./module";

export function findBestLanguageTag<T extends string>(
  languageTags: readonly T[],
): { languageTag: T; isRTL: boolean } | undefined {
  const locales = getLocales();
  const loweredLanguageTags = languageTags.map((tag) => tag.toLowerCase());

  for (const currentLocale of locales) {
    const { languageTag, languageCode, scriptCode, countryCode, isRTL } =
      currentLocale;

    const combinaisons = [
      languageTag,
      !!scriptCode ? languageCode + "-" + scriptCode : null,
      languageCode + "-" + countryCode,
      languageCode,
    ].filter((value): value is string => !!value);

    for (const combinaison of combinaisons) {
      const loweredCombinaison = combinaison.toLowerCase();
      const tagIndex = loweredLanguageTags.indexOf(loweredCombinaison);
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
