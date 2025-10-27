import type { ReactNode } from "react";

// https://developer.apple.com/documentation/foundation/nscalendaridentifier?language=objc
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

export type TemperatureUnit = "celsius" | "fahrenheit";

export type ServerLanguagesProviderProps = {
  children: ReactNode;
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
