import { NativeModules } from "react-native";
import type {
  Calendar,
  Locale,
  NumberFormatSettings,
  TemperatureUnit,
} from "./types";

const NativeModule: Readonly<{
  getCalendar: () => Calendar;
  getCountry: () => string;
  getCurrencies: () => string[];
  getLocales: () => Locale[];
  getNumberFormatSettings: () => NumberFormatSettings;
  getTemperatureUnit: () => TemperatureUnit;
  getTimeZone: () => string;
  uses24HourClock: () => boolean;
  usesAutoDateAndTime: () => boolean | null;
  usesAutoTimeZone: () => boolean | null;
  usesMetricSystem: () => boolean;
}> = NativeModules.RNLocalize;

export const getCalendar = NativeModule.getCalendar;
export const getCountry = NativeModule.getCountry;
export const getCurrencies = NativeModule.getCurrencies;
export const getLocales = NativeModule.getLocales;
export const getNumberFormatSettings = NativeModule.getNumberFormatSettings;
export const getTemperatureUnit = NativeModule.getTemperatureUnit;
export const getTimeZone = NativeModule.getTimeZone;
export const uses24HourClock = NativeModule.uses24HourClock;
export const usesMetricSystem = NativeModule.usesMetricSystem;

export function usesAutoDateAndTime(): boolean | undefined {
  return NativeModule.usesAutoDateAndTime() ?? undefined;
}

export function usesAutoTimeZone(): boolean | undefined {
  return NativeModule.usesAutoTimeZone() ?? undefined;
}
