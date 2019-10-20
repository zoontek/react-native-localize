// @flow

import {
  USES_FAHRENHEIT,
  USES_IMPERIAL,
  USES_RTL_LAYOUT,
  CURRENCIES,
} from "./constants";

import type { Locale, LocalizationConstants } from "./types";

function getCountryCode(languageTagParts: string[]): ?string {
  // overwrite Latin America and Caribbean region
  return languageTagParts[1] === "419" ? "UN" : languageTagParts[1];
}

function getLocaleFromLanguageTag(
  languageTag: string,
  countryCodeFallback: string,
): Locale {
  const splitted = languageTag.split("-");
  const languageCode = splitted[0];
  const countryCode = getCountryCode(splitted) || countryCodeFallback;

  return {
    languageCode: languageCode,
    countryCode,
    languageTag: `${languageCode}-${countryCode}`,
    isRTL: USES_RTL_LAYOUT.includes(languageCode),
  };
}

function getFirstCountryCode(languageTags: $ReadOnlyArray<string>): ?string {
  for (let i = 0; i < languageTags.length; i++) {
    const countryCode = getCountryCode(languageTags[i].split("-"));

    if (countryCode) {
      return countryCode;
    }
  }
}

function generateConstants(
  languageTags: $ReadOnlyArray<string>,
): LocalizationConstants {
  const countryCode = getFirstCountryCode(languageTags);
  const locales: Locale[] = [];
  const currencies: string[] = [];

  languageTags.forEach(languageTag => {
    const locale = getLocaleFromLanguageTag(languageTag, countryCode);
    const currency = CURRENCIES[locale.countryCode];

    if (!locales.find(_ => _.languageTag === locale.languageTag)) {
      locales.push(locale);
    }

    if (currency && !currencies.includes(currency)) {
      currencies.push(currency);
    }
  });

  if (currencies.length === 0) {
    currencies.push("USD");
  }

  const numberFormatter = new Intl.NumberFormat(locales[0].languageTag);
  const dateFormatter = new Intl.DateTimeFormat(locales[0].languageTag, {
    hour: "numeric",
  });

  const numberSeparators = [
    ...numberFormatter.format(1000000.1).replace(/\d/g, ""),
  ];
  const numberFormatSettings = {
    decimalSeparator: numberSeparators[numberSeparators.length - 1],
    groupingSeparator: numberSeparators[0],
  };

  const eveningDate = new Date(2000, 0, 1, 20);
  const uses24HourClock = !!dateFormatter.format(eveningDate).match(/am|pm/i);

  return {
    calendar: "gregorian",
    country: countryCode,
    currencies,
    locales,
    numberFormatSettings,
    temperatureUnit: USES_FAHRENHEIT.includes(countryCode)
      ? "fahrenheit"
      : "celsius",
    timeZone: dateFormatter.resolvedOptions().timeZone || "Etc/UTC",
    uses24HourClock,
    usesMetricSystem: !USES_IMPERIAL.includes(countryCode),
  };
}

export const handlers: Set<Function> = new Set();
export let constants: LocalizationConstants = generateConstants(
  navigator.languages,
);

window.addEventListener("languagechange", () => {
  constants = generateConstants(navigator.languages);
  handlers.forEach(handler => handler());
});
