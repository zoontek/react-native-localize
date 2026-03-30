import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Locale {
  readonly languageCode: string;
  readonly scriptCode?: string;
  readonly countryCode: string;
  readonly languageTag: string;
  readonly isRTL: boolean;
}

export interface NumberFormatSettings {
  readonly decimalSeparator: string;
  readonly groupingSeparator: string;
}

export interface Spec extends TurboModule {
  /**
   * Returns the device's calendar system.
   */
  getCalendar(): string;

  /**
   * Returns the device's country/region code.
   */
  getCountry(): string;

  /**
   * Returns an array of currency codes for the device's locales.
   */
  getCurrencies(): string[];

  /**
   * Returns an array of device locales with language, script, and country information.
   */
  getLocales(): Locale[];

  /**
   * Returns the device's number format settings (decimal and grouping separators).
   */
  getNumberFormatSettings(): NumberFormatSettings;

  /**
   * Returns the device's preferred temperature unit.
   */
  getTemperatureUnit(): string;

  /**
   * Returns the device's time zone identifier.
   */
  getTimeZone(): string;

  /**
   * Returns whether the device uses 24-hour time format.
   */
  uses24HourClock(): boolean;

  /**
   * Returns whether the device uses the metric system.
   */
  usesMetricSystem(): boolean;

  /**
   * Returns whether automatic date and time is enabled, or null if unavailable.
   */
  usesAutoDateAndTime(): boolean | null;

  /**
   * Returns whether automatic time zone adjustment is enabled, or null if unavailable.
   */
  usesAutoTimeZone(): boolean | null;

  /**
   * Opens the app language settings. Returns true if successful.
   */
  openAppLanguageSettings(): Promise<boolean>;
}

export default TurboModuleRegistry.getEnforcing<Spec>("RNLocalize");
