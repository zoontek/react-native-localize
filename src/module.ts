import {
  CURRENCIES,
  USES_FAHRENHEIT,
  USES_IMPERIAL,
  USES_RTL_LAYOUT,
} from "./constants";
import type {
  Calendar,
  Locale,
  NumberFormatSettings,
  TemperatureUnit,
} from "./types";

function splitLanguageTag(languageTag: string): {
  languageCode: string;
  countryCode?: string;
} {
  const [languageCode = "en", countryCode] = languageTag.split("-");

  return {
    languageCode: languageCode.toLowerCase(),
    countryCode: countryCode
      ? (countryCode === "419" ? "UN" : countryCode).toUpperCase()
      : undefined,
  };
}

function convertLanguageTagToLocale(
  languageTag: string,
  countryCodeFallback: string,
): Locale {
  const { languageCode, countryCode = countryCodeFallback } =
    splitLanguageTag(languageTag);

  return {
    languageCode,
    countryCode,
    languageTag: `${languageCode}-${countryCode}`,
    isRTL: USES_RTL_LAYOUT.has(languageCode),
  };
}

function getNavigatorLanguages(): readonly string[] {
  return navigator.languages ?? [navigator.language];
}

export function getCalendar(): Calendar {
  return "gregorian";
}

export function getCountry(): string {
  const languages = getNavigatorLanguages();

  for (const language of languages) {
    const { countryCode } = splitLanguageTag(language);

    if (countryCode) {
      return countryCode;
    }
  }

  return "US";
}

export function getCurrencies(): string[] {
  const languages = getNavigatorLanguages();
  const currencies: string[] = [];

  for (const language of languages) {
    const { countryCode } = splitLanguageTag(language);

    if (countryCode) {
      const currency = CURRENCIES[countryCode];

      if (currency && currencies.indexOf(currency) === -1) {
        currencies.push(currency);
      }
    }
  }

  if (currencies.length === 0) {
    currencies.push("USD");
  }

  return currencies;
}

export function getLocales(): Locale[] {
  const languages = getNavigatorLanguages();
  const countryCode = getCountry();
  const cache: string[] = [];
  const locales: Locale[] = [];

  for (const language of languages) {
    const locale = convertLanguageTagToLocale(language, countryCode);

    if (cache.indexOf(locale.languageTag) === -1) {
      locales.push(locale);
      cache.push(locale.languageTag);
    }
  }

  return locales;
}

export function getNumberFormatSettings(): NumberFormatSettings {
  const formatter = new Intl.NumberFormat(navigator.language);
  const separators = formatter.format(1000000.1).replace(/\d/g, "");

  return {
    decimalSeparator: separators[separators.length - 1] || ".",
    groupingSeparator: separators[0] || ",",
  };
}

export function getTemperatureUnit(): TemperatureUnit {
  return USES_FAHRENHEIT.has(getCountry()) ? "fahrenheit" : "celsius";
}

export function getTimeZone(): string {
  const formatter = new Intl.DateTimeFormat(navigator.language, {
    hour: "numeric",
  });

  return formatter.resolvedOptions().timeZone || "Etc/UTC";
}

export function uses24HourClock(): boolean {
  const formatter = new Intl.DateTimeFormat(navigator.language, {
    hour: "numeric",
  });

  return !formatter.format(new Date(2000, 0, 1, 20)).match(/am|pm/i);
}

export function usesMetricSystem(): boolean {
  return !USES_IMPERIAL.has(getCountry());
}

export function usesAutoDateAndTime(): boolean | undefined {
  return;
}

export function usesAutoTimeZone(): boolean | undefined {
  return;
}

export async function openAppLanguageSettings(): Promise<void> {
  throw new Error("openAppLanguageSettings is supported only on Android 13+");
}
