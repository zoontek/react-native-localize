import { createContext, createElement, useContext, useState } from "react";
import {
  CURRENCIES,
  USES_FAHRENHEIT,
  USES_IMPERIAL,
  USES_RTL_LAYOUT,
} from "./constants";
import type {
  Calendar,
  Locale,
  LocalizeApi,
  NumberFormatSettings,
  ServerLanguagesProviderProps,
  TemperatureUnit,
} from "./types";
import { getFindBestLanguageTag } from "./utils";

const dateTimeFormatters = new Map<string, Intl.DateTimeFormat>();
const numberFormatters = new Map<string, Intl.NumberFormat>();

const extractLanguageTag = (
  languageTag: string,
): { languageCode: string; countryCode?: string } => {
  const [language = "en", country] = languageTag.split("-");

  return {
    languageCode: language.toLowerCase(),
    countryCode: country
      ? (country === "419" ? "UN" : country).toUpperCase()
      : undefined,
  };
};

const convertLanguageTagToLocale = (
  languageTag: string,
  countryFallback: string,
): Locale => {
  const { languageCode, countryCode = countryFallback } =
    extractLanguageTag(languageTag);

  return {
    languageCode,
    countryCode,
    languageTag: `${languageCode}-${countryCode}`,
    isRTL: USES_RTL_LAYOUT.has(languageCode),
  };
};

const getCountryImpl = (languages: readonly string[]): string => {
  for (const language of languages) {
    const { countryCode } = extractLanguageTag(language);

    if (countryCode) {
      return countryCode;
    }
  }

  return "US";
};

const getCurrenciesImpl = (languages: readonly string[]): string[] => {
  const currencies: string[] = [];

  for (const language of languages) {
    const { countryCode } = extractLanguageTag(language);

    if (countryCode) {
      const currency = CURRENCIES[countryCode];

      if (currency && !currencies.includes(currency)) {
        currencies.push(currency);
      }
    }
  }

  if (currencies.length === 0) {
    currencies.push("USD");
  }

  return currencies;
};

const getLocalesImpl = (
  languages: readonly string[],
  country: string,
): Locale[] => {
  const seen = new Set<string>();
  const locales: Locale[] = [];

  for (const language of languages) {
    const locale = convertLanguageTagToLocale(language, country);

    if (!seen.has(locale.languageTag)) {
      locales.push(locale);
      seen.add(locale.languageTag);
    }
  }

  return locales;
};

const getNumberFormatSettingsImpl = (
  language: string,
): NumberFormatSettings => {
  let formatter = numberFormatters.get(language);

  if (formatter == null) {
    formatter = new Intl.NumberFormat(language);
    numberFormatters.set(language, formatter);
  }

  const separators = formatter.format(1000000.1).replace(/\d/g, "");

  return {
    decimalSeparator: separators[separators.length - 1] || ".",
    groupingSeparator: separators[0] || ",",
  };
};

const getTemperatureUnitImpl = (country: string): TemperatureUnit =>
  USES_FAHRENHEIT.has(country) ? "fahrenheit" : "celsius";

const getTimeZoneImpl = (language: string): string => {
  let formatter = dateTimeFormatters.get(language);

  if (formatter == null) {
    formatter = new Intl.DateTimeFormat(language, { hour: "numeric" });
    dateTimeFormatters.set(language, formatter);
  }

  return formatter.resolvedOptions().timeZone || "Etc/UTC";
};

const uses24HourClockImpl = (language: string): boolean => {
  let formatter = dateTimeFormatters.get(language);

  if (formatter == null) {
    formatter = new Intl.DateTimeFormat(language, { hour: "numeric" });
    dateTimeFormatters.set(language, formatter);
  }

  return !formatter.format(new Date(2000, 0, 1, 20)).match(/am|pm/i);
};

const usesMetricSystemImpl = (country: string): boolean =>
  !USES_IMPERIAL.has(country);

/**
 * Returns the device's calendar system (e.g., "gregorian", "buddhist", "hebrew").
 * @returns {Calendar} The calendar identifier
 */
export const getCalendar = (): Calendar => "gregorian";

/**
 * Returns the device's country/region code (e.g., "US", "FR", "JP").
 * @returns {string} The ISO 3166-1 alpha-2 country code
 */
export const getCountry = (): string => getCountryImpl(navigator.languages);

/**
 * Returns an array of currency codes for the device's locales (e.g., ["USD", "EUR"]).
 * The array is ordered by preference based on the device's language settings.
 * @returns {string[]} Array of ISO 4217 currency codes
 */
export const getCurrencies = (): string[] =>
  getCurrenciesImpl(navigator.languages);

/**
 * Returns an array of device locales with language, script, and country information.
 * Each locale includes the language code, country code, language tag, script (if applicable),
 * and text direction (RTL or LTR).
 * @returns {Locale[]} Array of locale objects
 */
export const getLocales = (): Locale[] => {
  const { languages } = navigator;
  return getLocalesImpl(languages, getCountryImpl(languages));
};

/**
 * Returns the device's number format settings including decimal and grouping separators.
 * This reflects the device's locale preferences for number formatting.
 * @returns {NumberFormatSettings} Object with decimalSeparator and groupingSeparator
 */
export const getNumberFormatSettings = (): NumberFormatSettings =>
  getNumberFormatSettingsImpl(navigator.language);

/**
 * Returns the device's preferred temperature unit for weather and similar contexts.
 * @returns {TemperatureUnit} Either "celsius" or "fahrenheit"
 */
export const getTemperatureUnit = (): TemperatureUnit =>
  getTemperatureUnitImpl(getCountryImpl(navigator.languages));

/**
 * Returns the device's time zone identifier (e.g., "America/New_York", "Europe/London").
 * @returns {string} IANA time zone identifier
 */
export const getTimeZone = (): string => getTimeZoneImpl(navigator.language);

/**
 * Returns whether the device uses 24-hour time format (true) or 12-hour format (false).
 * @returns {boolean} True if device uses 24-hour format
 */
export const uses24HourClock = (): boolean =>
  uses24HourClockImpl(navigator.language);

/**
 * Returns whether the device uses the metric system for measurements.
 * @returns {boolean} True if metric system is used, false for imperial
 */
export const usesMetricSystem = (): boolean =>
  usesMetricSystemImpl(getCountryImpl(navigator.languages));

/**
 * Returns whether automatic date and time adjustment is enabled on the device.
 * May return undefined on platforms where this setting is unavailable.
 * @returns {boolean | undefined} True if auto-adjust is enabled, false if disabled, undefined if unavailable
 */
export const usesAutoDateAndTime = (): boolean | undefined => undefined;

/**
 * Returns whether automatic time zone adjustment is enabled on the device.
 * May return undefined on platforms where this setting is unavailable.
 * @returns {boolean | undefined} True if auto-adjust is enabled, false if disabled, undefined if unavailable
 */
export const usesAutoTimeZone = (): boolean | undefined => undefined;

/**
 * Finds the best matching language tag from a provided list based on device locales.
 * Attempts to match language tags considering language code, script code, and country code.
 * Falls back to more general matches (e.g., language-only) if exact matches aren't found.
 * @param {readonly T[]} languageTags - Array of language tags to search (e.g., ["en-US", "fr-FR"])
 * @returns {{ languageTag: T; isRTL: boolean } | undefined} The best matching tag and whether it uses RTL text direction, or undefined if no match is found
 * @example
 * const result = findBestLanguageTag(["en-US", "fr-FR"]);
 * if (result) {
 *   console.log(result.languageTag); // e.g., "en-US"
 *   console.log(result.isRTL); // false
 * }
 */
export const findBestLanguageTag = getFindBestLanguageTag(getLocales());

/**
 * Opens the app language settings on the device.
 * On Android 13+: Opens the system app language settings.
 * On other platforms: Throws an error as this feature is not supported.
 * @returns {Promise<void>} Promise that resolves when settings are opened
 * @throws {Error} On unsupported platforms (Web, iOS, macOS, Android < 13)
 * @example
 * try {
 *   await openAppLanguageSettings();
 * } catch (error) {
 *   console.error("Cannot open settings", error);
 * }
 */
export const openAppLanguageSettings = async (): Promise<void> => {
  throw new Error("openAppLanguageSettings is supported only on Android 13+");
};

const ServerLanguagesContext = createContext<string[] | null>(null);

export const ServerLanguagesProvider = ({
  children,
  value,
}: ServerLanguagesProviderProps) =>
  typeof window === "undefined"
    ? createElement(ServerLanguagesContext.Provider, { children, value })
    : children;

const api: LocalizeApi = {
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
};

export const useLocalize = (): LocalizeApi => {
  const languages = useContext(ServerLanguagesContext);

  return useState<LocalizeApi>(() => {
    if (languages == null) {
      return api;
    }

    const [language = "en"] = languages;

    const country = getCountryImpl(languages);
    const locales = getLocalesImpl(languages, country);

    return {
      getCalendar,
      getCountry: () => country,
      getCurrencies: () => getCurrenciesImpl(languages),
      getLocales: () => locales,
      getNumberFormatSettings: () => getNumberFormatSettingsImpl(language),
      getTemperatureUnit: () => getTemperatureUnitImpl(country),
      getTimeZone: () => getTimeZoneImpl(language),
      uses24HourClock: () => uses24HourClockImpl(language),
      usesMetricSystem: () => usesMetricSystemImpl(country),
      usesAutoDateAndTime,
      usesAutoTimeZone,
      findBestLanguageTag: getFindBestLanguageTag(locales),
      openAppLanguageSettings,
    };
  })[0];
};
