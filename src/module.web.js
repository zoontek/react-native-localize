// @flow

import {
  USES_FAHRENHEIT,
  USES_IMPERIAL,
  USES_RTL_LAYOUT,
  CURRENCIES,
} from "./constants";

import type { Locale, LocalizationConstants } from "./types";

function getLocaleFromLanguageTag(
  languageTag: string,
  countryCodeFallback: string,
): Locale {
  const splitted = languageTag.split("-");
  const languageCode = splitted[0];

  if (splitted[1] === "419") {
    splitted[1] = "UN"; // overwrite Latin America and Caribbean region
  }

  const countryCode = splitted[1] || countryCodeFallback;

  return {
    languageCode: languageCode,
    countryCode,
    languageTag: `${languageCode}-${countryCode}`,
    isRTL: USES_RTL_LAYOUT.includes(languageCode),
  };
}

function generateConstants(
  languageTags: $ReadOnlyArray<string>,
): LocalizationConstants {
  const base = getLocaleFromLanguageTag(languageTags[0], "US");

  const currencies: string[] = [];
  const locales: Locale[] = [];

  const numberFormatter = new Intl.NumberFormat(base.languageTag);
  const dateFormatter = new Intl.DateTimeFormat(base.languageTag, {
    hour: "numeric",
  });

  languageTags.forEach(languageTag => {
    const locale = getLocaleFromLanguageTag(languageTag, base.countryCode);
    const currency = CURRENCIES[locale.countryCode] || "USD";

    if (!locales.find(_ => _.languageTag === locale.languageTag)) {
      locales.push(locale);
    }
    if (!currencies.includes(currency)) {
      currencies.push(currency);
    }
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
    country: base.countryCode,
    currencies,
    locales,
    numberFormatSettings,
    temperatureUnit: USES_FAHRENHEIT.includes(base.countryCode)
      ? "fahrenheit"
      : "celsius",
    timeZone: dateFormatter.resolvedOptions().timeZone || "Etc/UTC",
    uses24HourClock,
    usesMetricSystem: !USES_IMPERIAL.includes(base.countryCode),
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
