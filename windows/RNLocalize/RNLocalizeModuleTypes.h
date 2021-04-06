#pragma once

#include "NativeModules.h"

#include <optional>
#include <string>

// These should stay aligned with those defined here
// https://github.com/react-native-community/react-native-localize/tree/master/src

REACT_STRUCT(Locale)
struct Locale
{
    REACT_FIELD(languageCode, L"languageCode")
    std::string languageCode;

    REACT_FIELD(scriptCode, L"scriptCode")
    std::optional<std::string> scriptCode;

    REACT_FIELD(countryCode, L"countryCode")
    std::string countryCode;

    REACT_FIELD(languageTag, L"languageTag")
    std::string languageTag;

    REACT_FIELD(isRTL, L"isRTL")
    bool isRTL = false;
};

REACT_STRUCT(NumberFormatSettings)
struct NumberFormatSettings
{
    REACT_FIELD(decimalSeparator, L"decimalSeparator")
    std::string decimalSeparator;

    REACT_FIELD(groupingSeparator, L"groupingSeparator")
    std::string groupingSeparator;
};

REACT_STRUCT(LocalizationConstants)
struct LocalizationConstants
{
    REACT_FIELD(calendar, L"calendar")
    std::string calendar;

    REACT_FIELD(country, L"country")
    std::string country;

    REACT_FIELD(currencies, L"currencies")
    std::vector<std::string> currencies;

    REACT_FIELD(locales, L"locales")
    std::vector<Locale> locales;

    REACT_FIELD(numberFormatSettings, L"numberFormatSettings")
    NumberFormatSettings numberFormatSettings;

    REACT_FIELD(temperatureUnit, L"temperatureUnit")
    std::string temperatureUnit;

    REACT_FIELD(timeZone, L"timeZone")
    std::string timeZone;

    REACT_FIELD(uses24HourClock, L"uses24HourClock")
    bool uses24HourClock = false;

    REACT_FIELD(usesMetricSystem, L"usesMetricSystem")
    bool usesMetricSystem = true;

    REACT_FIELD(usesAutoDateAndTime, L"usesAutoDateAndTime")
    std::optional<bool> usesAutoDateAndTime;

    REACT_FIELD(usesAutoTimeZone, L"usesAutoTimeZone")
    std::optional<bool> usesAutoTimeZone;
};
