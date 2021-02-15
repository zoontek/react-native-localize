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
import { Locale, LocalizationEvent } from "./types";

function logUnknownEvent(type: string) {
  console.error(`\`${type}\` is not a valid react-native-localize event`);
}

function getPartialTag({ languageCode, scriptCode }: Locale) {
  return languageCode + (scriptCode ? "-" + scriptCode : "");
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

  for (let i = 0; i < locales.length; i++) {
    const currentLocale = locales[i];
    const { languageTag, languageCode, isRTL } = currentLocale;

    if (languageTags.includes(languageTag as T)) {
      return { languageTag: languageTag as T, isRTL };
    }

    const partial = getPartialTag(currentLocale);
    const next = locales[i + 1];

    if (
      (!next || partial !== getPartialTag(next)) &&
      languageTags.includes(partial as T)
    ) {
      return { languageTag: partial as T, isRTL };
    }

    if (
      (!next || languageCode !== next.languageCode) &&
      languageTags.includes(languageCode as T)
    ) {
      return { languageTag: languageCode as T, isRTL };
    }
  }
}

export * from "./types";

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
