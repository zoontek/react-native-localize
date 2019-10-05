// @flow

import React from "react";
import { NativeModules, NativeEventEmitter } from "react-native";

import type {
  Calendar,
  Locale,
  LocalizationConstants,
  LocalizationEvent,
  NumberFormatSettings,
  Option,
  TemperatureUnit,
} from "./types";

const { RNLocalize } = NativeModules;

let constants: LocalizationConstants = RNLocalize.initialConstants;

const emitter = new NativeEventEmitter(RNLocalize);
const handlers: Set<Function> = new Set();

emitter.addListener("localizationDidChange", (next: LocalizationConstants) => {
  if (JSON.stringify(next) !== JSON.stringify(constants)) {
    constants = next;
    handlers.forEach(handler => handler());
  }
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
