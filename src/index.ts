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
  addEventListener,
  removeEventListener,
};
