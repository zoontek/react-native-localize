import * as RawMocks from ".";

export const getCalendar = jest.fn(RawMocks.getCalendar); // the calendar identifier you want
export const getCountry = jest.fn(RawMocks.getCountry); // the country code you want
export const getCurrencies = jest.fn(RawMocks.getCurrencies); // can be empty array

export const getLocales = jest.fn(RawMocks.getLocales);

export const getNumberFormatSettings = jest.fn(
  RawMocks.getNumberFormatSettings,
);

// use a provided translation, or return undefined to test your fallback
export const findBestLanguageTag = jest.fn(RawMocks.findBestLanguageTag);

export const getTemperatureUnit = jest.fn(RawMocks.getTemperatureUnit); // or "fahrenheit"
export const getTimeZone = jest.fn(RawMocks.getTimeZone); // the timezone you want
export const uses24HourClock = jest.fn(RawMocks.uses24HourClock);
export const usesAutoDateAndTime = jest.fn(RawMocks.usesAutoDateAndTime);
export const usesAutoTimeZone = jest.fn(RawMocks.usesAutoTimeZone);
export const usesMetricSystem = jest.fn(RawMocks.usesMetricSystem);
