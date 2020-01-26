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

if (__DEV__ && RNLocalize == null) {
  throw new Error(`react-native-localize: NativeModule.RNLocalize is null. To fix this issue try these steps:
• Run \`react-native link react-native-localize\` in the project root.
• Rebuild and re-run the app.
• If you are using CocoaPods on iOS, run \`pod install\` in the \`ios\` directory and then rebuild and re-run the app. You may also need to re-open Xcode to get the new pods.
• Check that the library was linked correctly when you used the link command by running through the manual installation instructions in the README.
* If you are getting this error while unit testing you need to mock the native module. Follow the guide in the README.
If none of these fix the issue, please open an issue on the Github repository: https://github.com/react-native-community/react-native-localize`);
}

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
