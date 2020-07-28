declare module "react-native-localize" {
  type Option<T> = T | undefined;

  export type Calendar = "gregorian" | "japanese" | "buddhist";
  export type LocalizationEvent = "change";
  export type TemperatureUnit = "celsius" | "fahrenheit";

  export type Locale = Readonly<{
    languageCode: string;
    scriptCode?: string;
    countryCode: string;
    languageTag: string;
    isRTL: boolean;
  }>;

  export type NumberFormatSettings = Readonly<{
    decimalSeparator: string;
    groupingSeparator: string;
  }>;

  export function getCalendar(): Calendar;
  export function getCountry(): string;
  export function getCurrencies(): string[];
  export function getLocales(): Locale[];
  export function getNumberFormatSettings(): NumberFormatSettings;
  export function getTemperatureUnit(): TemperatureUnit;
  export function getTimeZone(): string;
  export function uses24HourClock(): boolean;
  export function usesMetricSystem(): boolean;
  export function usesAutoDateAndTime(): Option<boolean>;
  export function usesAutoTimeZone(): Option<boolean>;

  export function addEventListener(
    type: LocalizationEvent,
    handler: Function,
  ): void;

  export function removeEventListener(
    type: LocalizationEvent,
    handler: Function,
  ): void;

  export function findBestAvailableLanguage<T extends string>(
    languageTags: ReadonlyArray<T>,
  ): { languageTag: T; isRTL: boolean } | undefined;
}
