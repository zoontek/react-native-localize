import type { ReactNode } from "react";

/**
 * Calendar system identifiers.
 * See: https://developer.apple.com/documentation/foundation/nscalendaridentifier?language=objc
 */
export type Calendar =
  | "gregorian"
  | "buddhist"
  | "coptic"
  | "ethiopic"
  | "ethiopic-amete-alem"
  | "hebrew"
  | "indian"
  | "islamic"
  | "islamic-umm-al-qura"
  | "islamic-civil"
  | "islamic-tabular"
  | "iso8601"
  | "japanese"
  | "persian";

/**
 * Device locale information including language, region, and text direction.
 * @example
 * {
 *   languageCode: "en",
 *   countryCode: "US",
 *   languageTag: "en-US",
 *   scriptCode: undefined,
 *   isRTL: false
 * }
 */
export type Locale = Readonly<{
  /** ISO 639-1 language code (e.g., "en", "fr", "ar") */
  languageCode: string;
  /** ISO 15924 script code, if applicable (e.g., "Hans" for simplified Chinese) */
  scriptCode?: string;
  /** ISO 3166-1 alpha-2 country/region code (e.g., "US", "FR", "JP") */
  countryCode: string;
  /** Full language tag combining language, script, and country (e.g., "en-US", "zh-Hans-CN") */
  languageTag: string;
  /** Whether the locale uses right-to-left text direction */
  isRTL: boolean;
}>;

/**
 * Number formatting settings based on the device's locale preferences.
 * @example
 * {
 *   decimalSeparator: ".",
 *   groupingSeparator: ","
 * }
 */
export type NumberFormatSettings = Readonly<{
  /** Character used as decimal separator (e.g., "." or ",") */
  decimalSeparator: string;
  /** Character used as number group separator (e.g., "," or " ") */
  groupingSeparator: string;
}>;

/** Temperature unit preference: Celsius or Fahrenheit */
export type TemperatureUnit = "celsius" | "fahrenheit";

/**
 * Props for ServerLanguagesProvider component.
 * Used for server-side rendering or testing with custom language preferences.
 */
export type ServerLanguagesProviderProps = {
  /** React child component(s) */
  children: ReactNode;
  /** Array of language tags to use instead of device languages (for SSR/testing) */
  value: string[];
};

export type LocalizeApi = {
  getCalendar: () => Calendar;
  getCountry: () => string;
  getCurrencies: () => string[];
  getLocales: () => Locale[];
  getNumberFormatSettings: () => NumberFormatSettings;
  getTemperatureUnit: () => TemperatureUnit;
  getTimeZone: () => string;
  uses24HourClock: () => boolean;
  usesMetricSystem: () => boolean;
  usesAutoDateAndTime: () => boolean | undefined;
  usesAutoTimeZone: () => boolean | undefined;

  findBestLanguageTag: <T extends string>(
    languageTags: readonly T[],
  ) => { languageTag: T; isRTL: boolean } | undefined;

  openAppLanguageSettings: () => Promise<void>;
};
