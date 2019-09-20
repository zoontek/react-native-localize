// @flow

import React from "react";
import rtlDetect from "rtl-detect";
import LocaleCurrency from "locale-currency";
import type {
  Option,
  Calendar,
  LocalizationEvent,
  TemperatureUnit,
  Locale,
  NumberFormatSettings,
  LocalizationConstants,
} from "./types";

const handlers: Set<Function> = new Set();

function logUnsupportedEvent(type: string) {
  console.error(`\`${type}\` is not a valid RNLocalize event`);
}
function getPartialTag({ languageCode, scriptCode }: Locale) {
  return languageCode + (scriptCode ? "-" + scriptCode : "");
}

export function getCalendar(): Calendar {
  return "gregorian";
}
export function getCountry(): string {
  return getLocales()[0]?.countryCode;
}
export function getCurrencies(): string[] {
  return LocaleCurrency.getCurrency(getCountry());
}
export function getLocales(): Locale[] {
  return navigator.languages.map(languageTag => ({
    languageTag,
    countryCode: languageTag.split("-")[1],
    languageCode: languageTag.split("-")[0],
    isRTL: rtlDetect.isRtlLang(languageTag),
  }));
}
export function getNumberFormatSettings(): NumberFormatSettings {
  const languageTag = getLocales()[0]?.languageTag;
  const numberFormat = new Intl.NumberFormat(languageTag);
  const result = numberFormat.format(123456.789);
  const [groupingSeparator, decimalSeparator] = [...result.replace(/\d/g, "")];
  return { groupingSeparator, decimalSeparator };
}
export function getTemperatureUnit(): TemperatureUnit {
  const fahrenheitCountries = {
    US: true,
    LR: true,
    BZ: true,
    BS: true,
    FM: true,
    AG: true,
    KY: true,
    BM: true,
    MH: true,
    KN: true,
    VG: true,
    PW: true,
    MS: true,
  };
  return fahrenheitCountries[getCountry()] ? "fahrenheit" : "celsius";
}
export function getTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "";
}
export function uses24HourClock(): boolean {
  const date = new Date(Date.UTC(2012, 11, 12, 3, 0, 0));
  const dateString = date.toLocaleTimeString();
  return !(dateString.match(/am|pm/i) || date.toString().match(/am|pm/i));
}
export function usesMetricSystem(): boolean {
  const imperialCountries = {
    US: true,
    MM: true,
    LR: true,
  };
  return !imperialCountries[getCountry()];
}
export function usesAutoDateAndTime(): Option<boolean> {
  throw new Error("Not implemented");
}
export function usesAutoTimeZone(): Option<boolean> {
  throw new Error("Not implemented");
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
