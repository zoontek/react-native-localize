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
 * Gets the device's calendar system.
 * @returns A {@link Calendar} (e.g., `"gregorian"`)
 */
export const getCalendar = (): Calendar => "gregorian";

/**
 * Gets the device's country code.
 * @returns An ISO 3166-1 alpha-2 country code (e.g., `"US"`, `"FR"`)
 */
export const getCountry = (): string => getCountryImpl(navigator.languages);

/**
 * Gets currency codes for the device's locales.
 * @returns An array of ISO 4217 currency codes (e.g., `["USD", "EUR"]`)
 */
export const getCurrencies = (): string[] =>
  getCurrenciesImpl(navigator.languages);

/**
 * Gets the device's locales with language, country, and text direction info.
 * @returns An array of {@link Locale} objects
 */
export const getLocales = (): Locale[] => {
  const { languages } = navigator;
  return getLocalesImpl(languages, getCountryImpl(languages));
};

/**
 * Gets the device's decimal and grouping separators.
 * @returns A {@link NumberFormatSettings} object
 */
export const getNumberFormatSettings = (): NumberFormatSettings =>
  getNumberFormatSettingsImpl(navigator.language);

/**
 * Gets the device's preferred temperature unit.
 * @returns A {@link TemperatureUnit} (`"celsius"` or `"fahrenheit"`)
 */
export const getTemperatureUnit = (): TemperatureUnit =>
  getTemperatureUnitImpl(getCountryImpl(navigator.languages));

/**
 * Gets the device's IANA time zone.
 * @returns An IANA time zone identifier (e.g., `"America/New_York"`)
 */
export const getTimeZone = (): string => getTimeZoneImpl(navigator.language);

/**
 * Gets whether the device uses 24-hour time format.
 * @returns `true` if 24-hour, `false` if 12-hour
 */
export const uses24HourClock = (): boolean =>
  uses24HourClockImpl(navigator.language);

/**
 * Gets whether the device uses the metric system.
 * @returns `true` for metric, `false` for imperial
 */
export const usesMetricSystem = (): boolean =>
  usesMetricSystemImpl(getCountryImpl(navigator.languages));

/**
 * Gets whether automatic date & time is enabled.
 * @returns A `boolean`, or `undefined` if unsupported
 */
export const usesAutoDateAndTime = (): boolean | undefined => undefined;

/**
 * Gets whether automatic time zone is enabled.
 * @returns A `boolean`, or `undefined` if unsupported
 */
export const usesAutoTimeZone = (): boolean | undefined => undefined;

/**
 * Finds the best matching language tag from the given list based on device locales.
 * @param languageTags - An array of BCP 47 language tags to match against
 * @returns The best match with its `isRTL` flag, or `undefined` if none found
 */
export const findBestLanguageTag = getFindBestLanguageTag(getLocales());

/**
 * Opens the system app language settings. Only supported on Android 13+.
 * @throws On unsupported platforms
 */
export const openAppLanguageSettings = async (): Promise<void> => {
  throw new Error("openAppLanguageSettings is supported only on Android 13+");
};

const ServerLanguagesContext = createContext<string[] | null>(null);

/**
 * Provides custom language tags for SSR / testing.
 * Only active server-side; on the client, renders children as-is.
 *
 * @example
 * ```tsx
 * <ServerLanguagesProvider value={["fr-FR", "en-US"]}>
 *   <App />
 * </ServerLanguagesProvider>
 * ```
 */
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

/**
 * Returns the {@link LocalizeApi} localization API.
 * Uses device languages on the client, or {@link ServerLanguagesProvider} values during SSR.
 *
 * @example
 * ```tsx
 * const { getLocales, getTemperatureUnit } = useLocalize();
 * ```
 */
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
