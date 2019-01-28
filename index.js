// @flow

// $FlowFixMe
import { NativeModules, NativeEventEmitter } from "react-native";
const { RNLocalize } = NativeModules;

export type LocalizationEvent = "change";

export type Calendar = "gregorian" | "japanese" | "buddhist";
export type TemperatureUnit = "celsius" | "fahrenheit";

export type Locale = {|
  +languageCode: string,
  +scriptCode?: string,
  +countryCode: string,
  +languageTag: string,
  +isRTL: boolean,
|};

let constants = RNLocalize.initialConstants;
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
