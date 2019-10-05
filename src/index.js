// @flow

import { constants, handlers } from "./module";

import type {
  Calendar,
  Locale,
  LocalizationEvent,
  NumberFormatSettings,
  Option,
  TemperatureUnit,
} from "./types";

export type {
  Calendar,
  Locale,
  LocalizationEvent,
  NumberFormatSettings,
  TemperatureUnit,
} from "./types";

function logUnsupportedEvent(type: string) {
  console.error(`\`${type}\` is not a valid react-native-localize event`);
}
function getPartialTag({ languageCode, scriptCode }: Locale) {
  return languageCode + (scriptCode ? "-" + scriptCode : "");
}

export function getCalendar(): Calendar {
  return constants.calendar;
}
export function getCountry(): string {
  return constants.country;
}
export function getCurrencies(): string[] {
  return constants.currencies;
}
export function getLocales(): Locale[] {
  return constants.locales;
}
export function getNumberFormatSettings(): NumberFormatSettings {
  return constants.numberFormatSettings;
}
export function getTemperatureUnit(): TemperatureUnit {
  return constants.temperatureUnit;
}
export function getTimeZone(): string {
  return constants.timeZone;
}
export function uses24HourClock(): boolean {
  return constants.uses24HourClock;
}
export function usesMetricSystem(): boolean {
  return constants.usesMetricSystem;
}
export function usesAutoDateAndTime(): Option<boolean> {
  return constants.usesAutoDateAndTime;
}
export function usesAutoTimeZone(): Option<boolean> {
  return constants.usesAutoTimeZone;
}

export function addEventListener(
  type: LocalizationEvent,
  handler: Function,
): void {
  if (type !== "change") {
    logUnsupportedEvent(type);
  } else if (!handlers.has(handler)) {
    handlers.add(handler);
  }
}

export function removeEventListener(
  type: LocalizationEvent,
  handler: Function,
): void {
  if (type !== "change") {
    logUnsupportedEvent(type);
  } else if (handlers.has(handler)) {
    handlers.delete(handler);
  }
}

export function findBestAvailableLanguage(
  languageTags: string[],
): {|
  languageTag: string,
  isRTL: boolean,
|} | void {
  const locales = getLocales();

  for (let index = 0; index < locales.length; index++) {
    const currentLocale = locales[index];
    const { languageTag, languageCode, isRTL } = currentLocale;

    if (languageTags.includes(languageTag)) {
      return { languageTag, isRTL };
    }

    const partialTag = getPartialTag(currentLocale);
    const next = locales[index + 1];

    if (
      (!next || partialTag !== getPartialTag(next)) &&
      languageTags.includes(partialTag)
    ) {
      return { languageTag: partialTag, isRTL };
    }

    if (
      (!next || languageCode !== next.languageCode) &&
      languageTags.includes(languageCode)
    ) {
      return { languageTag: languageCode, isRTL };
    }
  }
}
