export {
  ServerLanguagesProvider,
  /**
   * Finds the best matching language tag from a provided list based on device locales.
   * Attempts to match language tags considering language code, script code, and country code.
   */
  findBestLanguageTag,
  /**
   * Returns the device's calendar system (e.g., "gregorian", "buddhist", "hebrew").
   */
  getCalendar,
  /**
   * Returns the device's country/region code (e.g., "US", "FR", "JP").
   */
  getCountry,
  /**
   * Returns an array of currency codes for the device's locales.
   */
  getCurrencies,
  /**
   * Returns an array of device locales with language, script, and country information.
   */
  getLocales,
  /**
   * Returns the device's number format settings (decimal and grouping separators).
   */
  getNumberFormatSettings,
  /**
   * Returns the device's preferred temperature unit ("celsius" or "fahrenheit").
   */
  getTemperatureUnit,
  /**
   * Returns the device's time zone identifier (e.g., "America/New_York").
   */
  getTimeZone,
  /**
   * Opens the app language settings (Android 13+ only).
   */
  openAppLanguageSettings,
  /**
   * Hook to access localization functions with context-aware values.
   */
  useLocalize,
  /**
   * Returns whether the device uses 24-hour time format.
   */
  uses24HourClock,
  /**
   * Returns whether automatic date and time adjustment is enabled.
   */
  usesAutoDateAndTime,
  /**
   * Returns whether automatic time zone adjustment is enabled.
   */
  usesAutoTimeZone,
  /**
   * Returns whether the device uses the metric system.
   */
  usesMetricSystem,
} from "./module";

export type {
  Calendar,
  Locale,
  NumberFormatSettings,
  TemperatureUnit,
} from "./types";
