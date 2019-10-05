// @flow

export type Option<T> = T | typeof undefined;

export type Calendar = "gregorian" | "japanese" | "buddhist";
export type LocalizationEvent = "change";
export type TemperatureUnit = "celsius" | "fahrenheit";

export type Locale = $ReadOnly<{|
  languageCode: string,
  scriptCode?: string,
  countryCode: string,
  languageTag: string,
  isRTL: boolean,
|}>;

export type NumberFormatSettings = $ReadOnly<{|
  decimalSeparator: string,
  groupingSeparator: string,
|}>;

export type LocalizationConstants = $ReadOnly<{|
  calendar: Calendar,
  country: string,
  currencies: string[],
  locales: Locale[],
  numberFormatSettings: NumberFormatSettings,
  temperatureUnit: TemperatureUnit,
  timeZone: string,
  uses24HourClock: boolean,
  usesMetricSystem: boolean,
  usesAutoDateAndTime?: boolean,
  usesAutoTimeZone?: boolean,
|}>;
