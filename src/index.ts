import { getLocales } from "./module";

function isMatchingLanguage(languageTag: string, languageCode: string) {
  return languageTag.toLowerCase().split("-")[0] === languageCode.toLowerCase();
}

export function findBestLanguageTag<T extends string>(
  languageTags: ReadonlyArray<T>,
  preferFirstMatchingLanguage?: boolean,
): { languageTag: T; isRTL: boolean } | undefined {
  const locales = getLocales();
  const loweredLanguageTags = languageTags.map((tag) => tag.toLowerCase());

  let firstMatch: ReturnType<typeof findBestLanguageTag<T>>;

  for (let i = 0; i < locales.length; i++) {
    const currentLocale = locales[i];

    if (!currentLocale) {
      continue;
    }

    const { languageTag, languageCode, scriptCode, countryCode, isRTL } =
      currentLocale;

    if (firstMatch !== undefined && !isMatchingLanguage(firstMatch.languageTag, languageCode)) {
      continue; // when preferFirstMatchingLanguage is true and we already found a matching language, ignore any other languages
    }

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

    if (preferFirstMatchingLanguage === true && firstMatch === undefined) {
      const languageTag = languageTags.find((tag) => isMatchingLanguage(tag, languageCode));
      if (languageTag) {
        firstMatch = { languageTag, isRTL };
      }
    }
  }

  if (firstMatch !== undefined) {
    return firstMatch;
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
