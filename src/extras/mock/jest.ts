import * as mock from ".";

/**
 * Jest mock for getCalendar function.
 * Can be configured using jest.fn() methods like mockReturnValue().
 * @example
 * getCalendar.mockReturnValue("buddhist");
 */
export const getCalendar = jest.fn(mock.getCalendar);

/**
 * Jest mock for getCountry function.
 * Can be configured to return different country codes for testing.
 * @example
 * getCountry.mockReturnValue("FR");
 */
export const getCountry = jest.fn(mock.getCountry);

/**
 * Jest mock for getCurrencies function.
 * Can be configured to return different currency arrays for testing.
 * @example
 * getCurrencies.mockReturnValue(["EUR", "GBP"]);
 */
export const getCurrencies = jest.fn(mock.getCurrencies);

/**
 * Jest mock for getLocales function.
 * Can be configured to return different locale arrays for testing.
 */
export const getLocales = jest.fn(mock.getLocales);

/**
 * Jest mock for getNumberFormatSettings function.
 * Can be configured with different separators for testing.
 * @example
 * getNumberFormatSettings.mockReturnValue({
 *   decimalSeparator: ",",
 *   groupingSeparator: " "
 * });
 */
export const getNumberFormatSettings = jest.fn(mock.getNumberFormatSettings);

/**
 * Jest mock for getTemperatureUnit function.
 * Can be configured to return either "celsius" or "fahrenheit".
 * @example
 * getTemperatureUnit.mockReturnValue("fahrenheit");
 */
export const getTemperatureUnit = jest.fn(mock.getTemperatureUnit);

/**
 * Jest mock for getTimeZone function.
 * Can be configured to return different timezone identifiers.
 * @example
 * getTimeZone.mockReturnValue("America/Los_Angeles");
 */
export const getTimeZone = jest.fn(mock.getTimeZone);

/**
 * Jest mock for uses24HourClock function.
 * Can be configured to return true or false for testing different time formats.
 */
export const uses24HourClock = jest.fn(mock.uses24HourClock);

/**
 * Jest mock for usesMetricSystem function.
 * Can be configured to return true or false for metric vs imperial testing.
 */
export const usesMetricSystem = jest.fn(mock.usesMetricSystem);

/**
 * Jest mock for usesAutoDateAndTime function.
 * Can be configured to test different automatic time settings.
 */
export const usesAutoDateAndTime = jest.fn(mock.usesAutoDateAndTime);

/**
 * Jest mock for usesAutoTimeZone function.
 * Can be configured to test different timezone settings.
 */
export const usesAutoTimeZone = jest.fn(mock.usesAutoTimeZone);

/**
 * Jest mock for findBestLanguageTag function.
 * Can be configured to return matches or undefined for testing fallbacks.
 * @example
 * findBestLanguageTag.mockReturnValue({
 *   languageTag: "de-DE",
 *   isRTL: false
 * });
 */
export const findBestLanguageTag = jest.fn(mock.findBestLanguageTag);

/**
 * Jest mock for openAppLanguageSettings function.
 * Can be configured to simulate success or failure scenarios.
 */
export const openAppLanguageSettings = jest.fn(mock.openAppLanguageSettings);

/**
 * Non-mocked ServerLanguagesProvider component from base mock.
 */
export const ServerLanguagesProvider = mock.ServerLanguagesProvider;

/**
 * Jest mock for useLocalize hook.
 * Can be configured to return customized mock API objects.
 * @example
 * useLocalize.mockReturnValue({
 *   getCountry: () => "FR",
 *   // ... other mock methods
 * });
 */
export const useLocalize = jest.fn(mock.useLocalize);
