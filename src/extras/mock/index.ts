import type { ReactNode } from "react";

/**
 * Mock implementation of getCalendar for testing purposes.
 * @returns {string} The calendar system ("gregorian" by default for testing)
 */
export const getCalendar = () => "gregorian";

/**
 * Mock implementation of getCountry for testing purposes.
 * @returns {string} A country code ("US" by default for testing)
 */
export const getCountry = () => "US";

/**
 * Mock implementation of getCurrencies for testing purposes.
 * @returns {string[]} Array of currency codes for testing (["USD", "EUR"] by default)
 */
export const getCurrencies = () => ["USD", "EUR"];

/**
 * Mock implementation of getLocales for testing purposes.
 * Returns example locales that can be modified as needed for your tests.
 * @returns {Array} Array of mock locale objects with language, country, and RTL information
 */
export const getLocales = () => [
  // Extend if needed, add the locales you want to test with
  { countryCode: "US", languageTag: "en-US", languageCode: "en", isRTL: false },
  { countryCode: "FR", languageTag: "fr-FR", languageCode: "fr", isRTL: false },
];

/**
 * Mock implementation of getNumberFormatSettings for testing purposes.
 * @returns {Object} Mock number format settings with decimal and grouping separators
 */
export const getNumberFormatSettings = () => ({
  decimalSeparator: ".",
  groupingSeparator: ",",
});

/**
 * Mock implementation of getTemperatureUnit for testing purposes.
 * @returns {string} Temperature unit ("celsius" or "fahrenheit")
 */
export const getTemperatureUnit = () => "celsius";

/**
 * Mock implementation of getTimeZone for testing purposes.
 * @returns {string} IANA time zone identifier
 */
export const getTimeZone = () => "Europe/Paris";

/**
 * Mock implementation of uses24HourClock for testing purposes.
 * @returns {boolean} Whether to use 24-hour format
 */
export const uses24HourClock = () => true;

/**
 * Mock implementation of usesMetricSystem for testing purposes.
 * @returns {boolean} Whether metric system is used
 */
export const usesMetricSystem = () => true;

/**
 * Mock implementation of usesAutoDateAndTime for testing purposes.
 * @returns {boolean} Whether automatic date and time is enabled
 */
export const usesAutoDateAndTime = () => true;

/**
 * Mock implementation of usesAutoTimeZone for testing purposes.
 * @returns {boolean} Whether automatic time zone adjustment is enabled
 */
export const usesAutoTimeZone = () => true;

/**
 * Mock implementation of findBestLanguageTag for testing purposes.
 * Returns a fixed translation result, or undefined to test your fallback logic.
 * @returns {Object | undefined} Mock match result with language tag and RTL info
 */
export const findBestLanguageTag = () => ({
  languageTag: "en-US",
  isRTL: false,
});

/**
 * Mock implementation of openAppLanguageSettings for testing purposes.
 * Does nothing in mock mode (no actual app language settings are opened).
 * @returns {Promise<void>}
 */
export const openAppLanguageSettings = async () => {};

/**
 * Mock ServerLanguagesProvider component for testing.
 * Renders children as-is without managing any context.
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child component(s) to render
 * @returns {ReactNode} Returns the children component(s)
 */
export const ServerLanguagesProvider = ({
  children,
}: {
  children: ReactNode;
  value: string[];
}) => children;

/**
 * Mock implementation of useLocalize hook for testing purposes.
 * Provides a mock LocalizeApi object with fixed test values.
 * @returns {Object} Mock localize API object with all methods returning test data
 */
export const useLocalize = () => ({
  getCalendar,
  getCountry,
  getCurrencies,
  getLocales,
  getNumberFormatSettings,
  getTemperatureUnit,
  getTimeZone,
  uses24HourClock,
  usesMetricSystem,
  usesAutoDateAndTime,
  usesAutoTimeZone,
  findBestLanguageTag,
  openAppLanguageSettings,
});
