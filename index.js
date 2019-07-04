// @flow

import React from "react";
// $FlowFixMe
import { NativeModules, NativeEventEmitter } from "react-native";
const { RNLocalize } = NativeModules;

export type Calendar = "gregorian" | "japanese" | "buddhist";
export type LocalizationEvent = "change";
export type TemperatureUnit = "celsius" | "fahrenheit";

export type Locale = {|
  +languageCode: string,
  +scriptCode?: string,
  +countryCode: string,
  +languageTag: string,
  +isRTL: boolean,
|};

export type NumberFormatSettings = {|
  +decimalSeparator: string,
  +groupingSeparator: string,
|};

export type LocalizationConstants = {|
  calendar: Calendar,
  country: string,
  currencies: string[],
  locales: Locale[],
  numberFormatSettings: NumberFormatSettings,
  temperatureUnit: TemperatureUnit,
  timeZone: string,
  uses24HourClock: boolean,
  usesMetricSystem: boolean,
|};

let constants: LocalizationConstants = RNLocalize.initialConstants;
const emitter = new NativeEventEmitter(RNLocalize);
const handlers: Set<Function> = new Set();

emitter.addListener("localizationDidChange", nextConstants => {
  constants = nextConstants;
  handlers.forEach(handler => handler());
});

function logUnsupportedEvent(type: string) {
  console.error(`\`${type}\` is not a valid RNLocalize event`);
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
