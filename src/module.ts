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
  return NativeModule.getLocales() as Locale[];
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

export async function openAppLanguageSettings(): Promise<void> {
  await NativeModule.openAppLanguageSettings();
}
