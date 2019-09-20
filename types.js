// @flow
export type Option<T> = T | boolean;

export type Calendar = "gregorian" | "japanese" | "buddhist";
export type LocalizationEvent = "change";
export type TemperatureUnit = "celsius" | "fahrenheit";

export type Locale = {|
  +languageCode: string,
  +scriptCode?: string,
  +countryCode: string,
  +languageTag: string,
  +isRTL: boolean,
|};

export type NumberFormatSettings = {|
  +decimalSeparator: string,
  +groupingSeparator: string,
|};

export type LocalizationConstants = {|
  calendar: Calendar,
  country: string,
  currencies: string[],
  locales: Locale[],
  numberFormatSettings: NumberFormatSettings,
  temperatureUnit: TemperatureUnit,
  timeZone: string,
  uses24HourClock: boolean,
  usesMetricSystem: boolean,
  usesAutoDateAndTime: Option<boolean>,
  usesAutoTimeZone: Option<boolean>,
|};
