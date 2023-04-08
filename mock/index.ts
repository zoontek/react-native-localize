export const getLocales = () => [
  // extend if needed, add the locales you want
  { countryCode: "US", languageTag: "en-US", languageCode: "en", isRTL: false },
  { countryCode: "FR", languageTag: "fr-FR", languageCode: "fr", isRTL: false },
];

// use a provided translation, or return undefined to test your fallback
export const findBestLanguageTag = () => ({
  languageTag: "en-US",
  isRTL: false,
});

export const getNumberFormatSettings = () => ({
  decimalSeparator: ".",
  groupingSeparator: ",",
});

export const getCalendar = () => "gregorian"; // the calendar identifier you want
export const getCountry = () => "US"; // the country code you want
export const getCurrencies = () => ["USD", "EUR"]; // can be empty array
export const getTemperatureUnit = () => "celsius"; // or "fahrenheit"
export const getTimeZone = () => "Europe/Paris"; // the timezone you want
export const uses24HourClock = () => true;
export const usesMetricSystem = () => true;
export const usesAutoDateAndTime = () => true;
export const usesAutoTimeZone = () => true;

export default {
  getCalendar,
  getCountry,
  getCurrencies,
  getLocales,
  getNumberFormatSettings,
  getTemperatureUnit,
  getTimeZone,
  uses24HourClock,
  usesMetricSystem,
  usesAutoDateAndTime,
  usesAutoTimeZone,

  findBestLanguageTag,
};
