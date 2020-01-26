// @flow

import { NativeEventEmitter, NativeModules } from "react-native";
import { findBestLanguageForLocales, logUnknownEvent } from "./utils";

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

const emitter = new NativeEventEmitter(RNLocalize);
const handlers: Set<Function> = new Set();

emitter.addListener("localizationDidChange", (next: LocalizationConstants) => {
  if (JSON.stringify(next) !== JSON.stringify(constants)) {
    constants = next;
    handlers.forEach(handler => handler());
  }
});

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

export function findBestAvailableLanguage(
  languageTags: string[],
): {|
  languageTag: string,
  isRTL: boolean,
|} | void {
  return findBestLanguageForLocales(languageTags, getLocales());
}
