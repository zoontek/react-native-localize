import * as mock from ".";

export const getCalendar = jest.fn(mock.getCalendar);
export const getCountry = jest.fn(mock.getCountry);
export const getCurrencies = jest.fn(mock.getCurrencies);
export const getLocales = jest.fn(mock.getLocales);
export const getNumberFormatSettings = jest.fn(mock.getNumberFormatSettings);
export const findBestLanguageTag = jest.fn(mock.findBestLanguageTag);
export const getTemperatureUnit = jest.fn(mock.getTemperatureUnit);
export const getTimeZone = jest.fn(mock.getTimeZone);
export const uses24HourClock = jest.fn(mock.uses24HourClock);
export const usesAutoDateAndTime = jest.fn(mock.usesAutoDateAndTime);
export const usesAutoTimeZone = jest.fn(mock.usesAutoTimeZone);
export const usesMetricSystem = jest.fn(mock.usesMetricSystem);
export const openAppLanguageSettings = jest.fn(mock.openAppLanguageSettings);
