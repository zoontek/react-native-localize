#include "pch.h"

#include "RNLocalizeModule.h"

#include "winrt/Windows.Globalization.h"

using namespace winrt::Microsoft::ReactNative;

namespace winrt::ReactNativeLocalize
{

std::vector<winrt::hstring> RNLocalizeModule::getLocaleNames()
{
    std::vector<winrt::hstring> locales;
    for (winrt::hstring locale : winrt::Windows::Globalization::ApplicationLanguages::Languages())
    {
        locales.push_back(locale);
    }
    return locales;
}

std::vector<Locale> RNLocalizeModule::getLocales(std::vector<winrt::hstring> localeStrings)
{
    std::vector<Locale> localesArray;
    for (winrt::hstring localeString : localeStrings)
    {
        Locale locale;
        std::string languageCode = getLanguageCode(to_string(localeString));
        locale.languageCode = languageCode;

        std::string countryCode = getCountryCode(to_string(localeString));
        locale.countryCode = countryCode;

        locale.isRTL = getIsRTL(languageCode);

        std::string scriptCode = getScriptCode(localeString);
        locale.scriptCode = scriptCode;

        std::string languageTag = languageCode + "-" + scriptCode + "-" + countryCode;
        locale.languageTag = languageTag;

        localesArray.push_back(locale);
    }
    return localesArray;
}

std::string RNLocalizeModule::getCountryCode(std::string locale)
{
    return locale.substr(locale.find("-") + 1, locale.length());
}

std::string RNLocalizeModule::getLanguageCode(std::string locale)
{
    return locale.substr(0, locale.find("-"));
}

bool RNLocalizeModule::getIsRTL(std::string languageCode)
{
    return std::find(USES_RTL_LAYOUT.begin(), USES_RTL_LAYOUT.end(), languageCode) != USES_RTL_LAYOUT.end();
}

bool RNLocalizeModule::getUsesMetricSystem(std::string countryCode)
{
    return std::find(USES_IMPERIAL.begin(), USES_IMPERIAL.end(), countryCode) == USES_IMPERIAL.end();
}

std::string RNLocalizeModule::getTemperatureUnit(std::string countryCode)
{
    return std::find(USES_FAHRENHEIT.begin(), USES_FAHRENHEIT.end(), countryCode) != USES_FAHRENHEIT.end() ? "fahrenheit" : "celsius";
}

bool RNLocalizeModule::getUses24HourClock()
{
    return !to_string(winrt::Windows::Globalization::Calendar().GetClock()).compare("24HourClock");
}

std::vector<std::string> RNLocalizeModule::getCurrencies()
{
    std::vector<std::string> currencies;
    for (winrt::hstring currency : winrt::Windows::Globalization::GeographicRegion().CurrenciesInUse())
    {
        currencies.push_back(winrt::to_string(currency));
    }
    return currencies;
}

std::string RNLocalizeModule::getScriptCode(winrt::hstring locale)
{
    return winrt::to_string(winrt::Windows::Globalization::Language(locale).Script());
}

std::string RNLocalizeModule::getCalendar()
{
    std::string calendar = to_string(winrt::Windows::Globalization::Calendar().GetCalendarSystem());
    calendar = calendar.substr(0, calendar.size() - 8);
    std::transform(calendar.begin(), calendar.end(), calendar.begin(), ::tolower);
    return calendar;
}

std::string RNLocalizeModule::getTimeZone()
{
    // Use GetTimeZoneInformation to get the hour bias from GMT and then create a formatted string (KLUDGE)
    TIME_ZONE_INFORMATION TimeZoneInfo;
    GetTimeZoneInformation(&TimeZoneInfo);

    int hourBias = -TimeZoneInfo.Bias / 60;
    char timeZoneBuffer[10];
    snprintf(
        timeZoneBuffer,
        sizeof(timeZoneBuffer),
        "GMT%s%02d:00",
        hourBias < 0 ? "-" : "+",
        hourBias < 0 ? -hourBias : hourBias);
    std::string timeZoneString(timeZoneBuffer);

    return timeZoneString;
}

NumberFormatSettings RNLocalizeModule::getNumberFormatSettings(std::string locale)
{
    LPCWSTR locale_l = std::wstring(locale.begin(), locale.end()).c_str();

    NumberFormatSettings numberFormatSettings;

    // Use GetNumberFormatEx to get number formatting based on the passed locale (KLUDGE)
    std::string num_s("1000.00");
    std::wstring num_w = std::wstring(num_s.begin(), num_s.end());
    LPCWSTR num_l = num_w.c_str();

    LPWSTR numberFormatBuffer = new TCHAR[9];
    GetNumberFormatEx(locale_l, NULL, num_l, NULL, numberFormatBuffer, 9);
    std::string formattedString = winrt::to_string(numberFormatBuffer);
    delete numberFormatBuffer;

    numberFormatSettings.decimalSeparator = formattedString.substr(5, 1);
    numberFormatSettings.groupingSeparator = formattedString.substr(1, 1);

    return numberFormatSettings;
}

LocalizationConstants RNLocalizeModule::getExported()
{
    std::vector<winrt::hstring> deviceLocales = getLocaleNames();
    std::string currentLocale = winrt::to_string(deviceLocales[0]);
    std::string currentCountryCode = getCountryCode(currentLocale);

    LocalizationConstants constants;
    constants.calendar = getCalendar();
    constants.country = currentCountryCode;
    constants.currencies = getCurrencies();
    constants.locales = getLocales(deviceLocales);
    constants.numberFormatSettings = getNumberFormatSettings(currentLocale);
    constants.temperatureUnit = getTemperatureUnit(currentCountryCode);
    constants.timeZone = getTimeZone();
    constants.uses24HourClock = getUses24HourClock();
    constants.usesMetricSystem = getUsesMetricSystem(currentCountryCode);
    return constants;
}

void RNLocalizeModule::GetConstants(winrt::Microsoft::ReactNative::ReactConstantProvider &provider) noexcept
{
    provider.Add(L"initialConstants", getExported());
}

LocalizationConstants RNLocalizeModule::initialConstants() noexcept
{
    std::vector<winrt::hstring> deviceLocales = getLocaleNames();
    std::string currentLocale = winrt::to_string(deviceLocales[0]);
    std::string currentCountryCode = getCountryCode(currentLocale);

    LocalizationConstants constants;
    constants.locales = getLocales(deviceLocales);
    return constants;
}

} // namespace winrt::ReactNativeLocalize
