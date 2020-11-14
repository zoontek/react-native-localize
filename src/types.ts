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
