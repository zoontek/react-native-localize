// @flow

import {
  USES_FAHRENHEIT,
  USES_IMPERIAL,
  USES_RTL_LAYOUT,
  CURRENCIES,
} from "./constants";

import type {
  Calendar,
  Locale,
  NumberFormatSettings,
  Option,
  TemperatureUnit,
} from "./types";

const canUseDOM = !!(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
);

function ensureCountryCode(countryCode: string): string {
  return countryCode === "419" ? "UN" : countryCode.toUpperCase();
}

function splitLanguageTag(
  languageTag: string,
): {|
  languageCode: string,
  countryCode?: string,
|} {
  const [languageCode, countryCode] = languageTag.split("-");
  return { languageCode, countryCode };
}

function convertLanguageTagToLocale(
  languageTag: string,
  countryCodeFallback: string,
): Locale {
  let { languageCode, countryCode } = splitLanguageTag(languageTag);
  languageCode = languageCode.toLowerCase();
  countryCode = ensureCountryCode(countryCode || countryCodeFallback);

  return {
    languageCode,
    countryCode,
    languageTag: `${languageCode}-${countryCode}`,
    isRTL: USES_RTL_LAYOUT.includes(languageCode),
  };
}

function getCurrentLocale(): Locale {
  return convertLanguageTagToLocale(navigator.language, getCountry());
}

export function getCalendar(): Calendar {
  return "gregorian";
}

export function getCountry(): string {
  const { languages } = navigator;

  for (let i = 0; i < languages.length; i++) {
    const { countryCode } = splitLanguageTag(languages[i]);

    if (countryCode) {
      return ensureCountryCode(countryCode);
    }
  }

  return "US";
}

export function getCurrencies(): string[] {
  const { languages } = navigator;
  const currencies: string[] = [];

  languages.forEach((language) => {
    const { countryCode } = splitLanguageTag(language);

    if (countryCode) {
      const currency = CURRENCIES[ensureCountryCode(countryCode)];

      if (currencies.indexOf(currency) === -1) {
        currencies.push(currency);
      }
    }
  });

  if (currencies.length === 0) {
    currencies.push("USD");
  }

  return currencies;
}

export function getLocales(): Locale[] {
  const { languages } = navigator;
  const countryCode = getCountry();
  const cache: string[] = [];
  const locales: Locale[] = [];

  languages.forEach((language) => {
    const locale = convertLanguageTagToLocale(language, countryCode);

    if (cache.indexOf(locale.languageTag) === -1) {
      locales.push(locale);
      cache.push(locale.languageTag);
    }
  });

  return locales;
}

export function getNumberFormatSettings(): NumberFormatSettings {
  const { languageTag } = getCurrentLocale();
  const formatter = new Intl.NumberFormat(languageTag);
  const separators = [...formatter.format(1000000.1).replace(/\d/g, "")];

  return {
    decimalSeparator: separators[separators.length - 1],
    groupingSeparator: separators[0],
  };
}

export function getTemperatureUnit(): TemperatureUnit {
  return USES_FAHRENHEIT.includes(getCountry()) ? "fahrenheit" : "celsius";
}

export function getTimeZone(): string {
  const { languageTag } = getCurrentLocale();
  const formatter = new Intl.DateTimeFormat(languageTag, { hour: "numeric" });
  return formatter.resolvedOptions().timeZone || "Etc/UTC";
}

export function uses24HourClock(): boolean {
  const { languageTag } = getCurrentLocale();
  const formatter = new Intl.DateTimeFormat(languageTag, { hour: "numeric" });
  return !formatter.format(new Date(2000, 0, 1, 20)).match(/am|pm/i);
}

export function usesMetricSystem(): boolean {
  return !USES_IMPERIAL.includes(getCountry());
}

export function usesAutoDateAndTime(): Option<boolean> {}
export function usesAutoTimeZone(): Option<boolean> {}

export const handlers: Set<Function> = new Set();

if (canUseDOM) {
  window.addEventListener("languagechange", () => {
    handlers.forEach((handler) => handler());
  });
}
