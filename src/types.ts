import type { ReactNode } from "react";

/**
 * Calendar system identifier
 * @see https://developer.apple.com/documentation/foundation/nscalendaridentifier?language=objc
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

/** Device locale information including language, region, and text direction */
export type Locale = Readonly<{
  /** ISO 639-1 language code (e.g., `"en"`, `"fr"`, `"ar"`) */
  languageCode: string;
  /** ISO 15924 script code, if applicable (e.g., `"Hans"` for simplified Chinese) */
  scriptCode?: string;
  /** ISO 3166-1 alpha-2 country/region code (e.g., `"US"`, `"FR"`) */
  countryCode: string;
  /** Full BCP 47 language tag (e.g., `"en-US"`, `"zh-Hans-CN"`) */
  languageTag: string;
  /** Whether the locale uses right-to-left text direction */
  isRTL: boolean;
}>;

/** Number formatting settings based on the device's locale */
export type NumberFormatSettings = Readonly<{
  /** Character used as decimal separator (e.g., `"."` or `","`) */
  decimalSeparator: string;
  /** Character used as thousands separator (e.g., `","` or `" "`) */
  groupingSeparator: string;
}>;

/** Temperature unit preference */
export type TemperatureUnit = "celsius" | "fahrenheit";

export type ServerLanguagesProviderProps = {
  /** React child component(s) to render */
  children: ReactNode;
  /** Array of BCP 47 language tags to use instead of device languages */
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
