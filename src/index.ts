import {
  getCalendar,
  getCountry,
  getCurrencies,
  getLocales,
  getNumberFormatSettings,
  getTemperatureUnit,
  getTimeZone,
  handlers,
  uses24HourClock,
  usesAutoDateAndTime,
  usesAutoTimeZone,
  usesMetricSystem,
} from "./module";
import { LocalizationEvent } from "./types";

function logUnknownEvent(type: string) {
  console.error(`\`${type}\` is not a valid react-native-localize event`);
}

export function addEventListener(
  type: LocalizationEvent,
  handler: Function,
): void {
  if (type !== "change") {
    logUnknownEvent(type);
  } else if (!handlers.has(handler)) {
    handlers.add(handler);
  }
}

export function removeEventListener(
  type: LocalizationEvent,
  handler: Function,
): void {
  if (type !== "change") {
    logUnknownEvent(type);
  } else if (handlers.has(handler)) {
    handlers.delete(handler);
  }
}

export function findBestAvailableLanguage<T extends string>(
  languageTags: ReadonlyArray<T>,
): { languageTag: T; isRTL: boolean } | undefined {
  const locales = getLocales();
  const loweredLanguageTags = languageTags.map((tag) => tag.toLowerCase());

  for (let i = 0; i < locales.length; i++) {
    const currentLocale = locales[i];
    const { languageTag, languageCode, countryCode, scriptCode, isRTL } = currentLocale;

    const languageTagIndex = loweredLanguageTags.indexOf(
      languageTag.toLowerCase(),
    );

    if (languageTagIndex !== -1) {
      return { languageTag: languageTags[languageTagIndex], isRTL };
    }

    if (scriptCode != null && scriptCode.length > 0) {
      const partialTagByScriptCodeAndCountryCodeIndex =
        loweredLanguageTags.indexOf(
          (languageCode + '-' + scriptCode + '-' + countryCode).toLowerCase(),
        )

      if (partialTagByScriptCodeAndCountryCodeIndex !== -1) {
        return {
          languageTag: languageTags[partialTagByScriptCodeAndCountryCodeIndex],
          isRTL,
        }
      }
      const partialTagByScriptCodeIndex = loweredLanguageTags.indexOf(
        (languageCode + '-' + scriptCode).toLowerCase(),
      )

      if (partialTagByScriptCodeIndex !== -1) {
        return { languageTag: languageTags[partialTagByScriptCodeIndex], isRTL }
      }
    }

    const partialTagIndex = loweredLanguageTags.indexOf(
      (languageCode + "-" + countryCode).toLowerCase(),
    );

    if (partialTagIndex !== -1) {
      return { languageTag: languageTags[partialTagIndex], isRTL };
    }

    const languageCodeIndex = loweredLanguageTags.indexOf(
      languageCode.toLowerCase(),
    );

    if (languageCodeIndex !== -1) {
      return { languageTag: languageTags[languageCodeIndex], isRTL };
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
  addEventListener,
  removeEventListener,
};
