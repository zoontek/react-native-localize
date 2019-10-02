// @flow

import React from "react";
import LocaleCurrency from "locale-currency";
import bcp47 from "bcp-47";
import type {
  Option,
  Calendar,
  LocalizationEvent,
  TemperatureUnit,
  Locale,
  NumberFormatSettings,
  LocalizationConstants,
} from "./types";

function logUnsupportedEvent(type: string) {
  console.error(`\`${type}\` is not a valid RNLocalize event`);
}
function getPartialTag({ languageCode, scriptCode }: Locale) {
  return languageCode + (scriptCode ? "-" + scriptCode : "");
}

const fahrenheitCountries = ["BS", "BZ", "KY", "PR", "PW", "US"];
const imperialCountries = ["LR", "MM", "US"];
const rtlCountries = [
  "ar",
  "ckb",
  "fa",
  "he",
  "ks",
  "lrc",
  "mzn",
  "ps",
  "ug",
  "ur",
  "yi",
];

export function getCalendar(): Calendar {
  return "gregorian";
}
export function getCountry(): string {
  const locales = getLocales();
  return locales[0] && locales[0].countryCode;
}
export function getCurrencies(): string[] {
  return [LocaleCurrency.getCurrency(getCountry())];
}
export function getLocales(): Locale[] {
  return navigator.languages.map(languageTag => {
    const { language: languageCode, region: countryCode } = bcp47.parse(
      languageTag,
    );
    return {
      languageTag,
      countryCode,
      languageCode,
      isRTL: rtlCountries.includes(countryCode.toLowerCase()),
    };
  });
}
export function getNumberFormatSettings(): NumberFormatSettings {
  const locales = getLocales();
  const languageTag = locales[0] && locales[0].languageTag;
  const numberFormat = new Intl.NumberFormat(languageTag);
  const result = numberFormat.format(123456.789);
  const [groupingSeparator, decimalSeparator] = [...result.replace(/\d/g, "")];
  return { groupingSeparator, decimalSeparator };
}
export function getTemperatureUnit(): TemperatureUnit {
  return fahrenheitCountries.find(code => code === getCountry())
    ? "fahrenheit"
    : "celsius";
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
  return !imperialCountries.find(code => code === getCountry());
}
export function usesAutoDateAndTime(): Option<boolean> {
  return false;
}
export function usesAutoTimeZone(): Option<boolean> {
  return false;
}

export function addEventListener(
  type: LocalizationEvent,
  handler: Function,
): void {
  if (type !== "change") {
    logUnsupportedEvent(type);
  } else {
    window.addEventListener("languagechange", handler);
  }
}

export function removeEventListener(
  type: LocalizationEvent,
  handler: Function,
): void {
  if (type !== "change") {
    logUnsupportedEvent(type);
  } else {
    window.removeEventListener("languagechange", handler);
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
