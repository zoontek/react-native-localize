import { NativeEventEmitter, Platform } from "react-native";
import NativeModule from "./NativeRNLocalize";
import type {
  Calendar,
  Locale,
  NumberFormatSettings,
  TemperatureUnit,
} from "./types";

export function getCalendar(): Calendar {
  return NativeModule.getCalendar() as Calendar;
}

export function getCountry(): string {
  return NativeModule.getCountry();
}

export function getCurrencies(): string[] {
  return NativeModule.getCurrencies();
}

export function getLocales(): Locale[] {
  return NativeModule.getLocales();
}

export function getNumberFormatSettings(): NumberFormatSettings {
  return NativeModule.getNumberFormatSettings() as NumberFormatSettings;
}

export function getTemperatureUnit(): TemperatureUnit {
  return NativeModule.getTemperatureUnit() as TemperatureUnit;
}

export function getTimeZone(): string {
  return NativeModule.getTimeZone();
}

export function uses24HourClock(): boolean {
  return NativeModule.uses24HourClock();
}

export function usesMetricSystem(): boolean {
  return NativeModule.usesMetricSystem();
}

export function usesAutoDateAndTime(): boolean | undefined {
  return NativeModule.usesAutoDateAndTime() ?? undefined;
}

export function usesAutoTimeZone(): boolean | undefined {
  return NativeModule.usesAutoTimeZone() ?? undefined;
}

export function setApplicationLocales(languageTags: string[]) {
  NativeModule.setApplicationLocales(languageTags);
}

export function getApplicationLocales(): Locale[] {
  return NativeModule.getApplicationLocales();
}

const moduleEventEmitter =
  Platform.OS === "android" ? new NativeEventEmitter() : undefined;

export function addLocaleChangedListener(
  listener: (locales: Locale[]) => void,
) {
  return moduleEventEmitter
    ? moduleEventEmitter.addListener("localeChange", listener)
    : { remove: () => {} };
}
