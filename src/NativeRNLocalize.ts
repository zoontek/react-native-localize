import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";
import { Locale } from "./types";

export interface Spec extends TurboModule {
  getCalendar(): string;
  getCountry(): string;
  getCurrencies(): string[];
  getLocales(): Locale[];
  getNumberFormatSettings(): Object;
  getTemperatureUnit(): string;
  getTimeZone(): string;
  uses24HourClock(): boolean;
  usesMetricSystem(): boolean;
  usesAutoDateAndTime(): boolean | null;
  usesAutoTimeZone(): boolean | null;
  setApplicationLocales(locales: string[]): void;
  getApplicationLocales(): Locale[];
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>("RNLocalize");
