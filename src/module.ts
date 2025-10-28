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

export const getCalendar = (): Calendar => "gregorian";
export const getCountry = (): string => getCountryImpl(navigator.languages);

export const getCurrencies = (): string[] =>
  getCurrenciesImpl(navigator.languages);

export const getLocales = (): Locale[] => {
  const { languages } = navigator;
  return getLocalesImpl(languages, getCountryImpl(languages));
};

export const getNumberFormatSettings = (): NumberFormatSettings =>
  getNumberFormatSettingsImpl(navigator.language);

export const getTemperatureUnit = (): TemperatureUnit =>
  getTemperatureUnitImpl(getCountryImpl(navigator.languages));

export const getTimeZone = (): string => getTimeZoneImpl(navigator.language);

export const uses24HourClock = (): boolean =>
  uses24HourClockImpl(navigator.language);

export const usesMetricSystem = (): boolean =>
  usesMetricSystemImpl(getCountryImpl(navigator.languages));

export const usesAutoDateAndTime = (): boolean | undefined => undefined;
export const usesAutoTimeZone = (): boolean | undefined => undefined;
export const findBestLanguageTag = getFindBestLanguageTag(getLocales());

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
