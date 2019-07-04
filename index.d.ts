declare module "react-native-localize" {
  export type Calendar = "gregorian" | "japanese" | "buddhist";
  export type LocalizationEvent = "change";
  export type TemperatureUnit = "celsius" | "fahrenheit";

  export type Locale = {
    readonly languageCode: string;
    readonly scriptCode?: string;
    readonly countryCode: string;
    readonly languageTag: string;
    readonly isRTL: boolean;
  };

  export type NumberFormatSettings = {
    decimalSeparator: string;
    groupingSeparator: string;
  };

  export type LocalizationConstants = {
    calendar: Calendar;
    country: string;
    currencies: string[];
    locales: Locale[];
    numberFormatSettings: NumberFormatSettings;
    temperatureUnit: TemperatureUnit;
    timeZone: string;
    uses24HourClock: boolean;
    usesMetricSystem: boolean;
  };

  export function getCalendar(): Calendar;
  export function getCountry(): string;
  export function getCurrencies(): string[];
  export function getLocales(): Locale[];
  export function getNumberFormatSettings(): NumberFormatSettings;
  export function getTemperatureUnit(): TemperatureUnit;
  export function getTimeZone(): string;
  export function uses24HourClock(): boolean;
  export function usesMetricSystem(): boolean;

  export function addEventListener(
    type: LocalizationEvent,
    handler: Function,
  ): void;

  export function removeEventListener(
    type: LocalizationEvent,
    handler: Function,
  ): void;

  export function findBestAvailableLanguage<T extends string>(
    languageTags: T[],
  ): { languageTag: T; isRTL: boolean } | void;
}
