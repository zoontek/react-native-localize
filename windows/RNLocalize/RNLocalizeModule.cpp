#include "pch.h"

#include "RNLocalizeModule.h"

#include <winrt/Windows.Globalization.h>
#include <winrt/Windows.System.UserProfile.h>
#include <winrt/Windows.System.h>

using namespace winrt::Microsoft::ReactNative;

namespace winrt::RNLocalize
{

/*static*/ const std::array<std::string, 6> RNLocalizeModule::USES_FAHRENHEIT{{"BS", "BZ", "KY", "PR", "PW", "US"}};
/*static*/ const std::array<std::string, 3> RNLocalizeModule::USES_IMPERIAL{{"LR", "MM", "US"}};

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
    winrt::Windows::Globalization::Language currentLanguage(localeString);

    std::string localeStdString = winrt::to_string(localeString);
    Locale locale;
    std::string languageCode = getLanguageCode(localeStdString);
    locale.languageCode = languageCode;

    std::string countryCode = getCountryCode(localeStdString);
    locale.countryCode = countryCode;

    locale.isRTL = getIsRTL(currentLanguage.LayoutDirection());

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

  winrt::Windows::Globalization::GeographicRegion geographicRegion{};
  return winrt::to_string(geographicRegion.CodeTwoLetter());
}

std::string RNLocalizeModule::getLanguageCode(std::string locale)
{
  return locale.substr(0, locale.find("-"));
}

bool RNLocalizeModule::getIsRTL(winrt::Windows::Globalization::LanguageLayoutDirection layoutDirection)
{
  switch (layoutDirection)
  {
  case winrt::Windows::Globalization::LanguageLayoutDirection::Ltr:
  case winrt::Windows::Globalization::LanguageLayoutDirection::TtbLtr:
  {
    return false;
  }
  case winrt::Windows::Globalization::LanguageLayoutDirection::Rtl:
  case winrt::Windows::Globalization::LanguageLayoutDirection::TtbRtl:
  default:
  {
    return true;
  }
  }
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
  return !winrt::to_string(winrt::Windows::Globalization::Calendar().GetClock()).compare("24HourClock");
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

  // Window's Calendar system can return any of these values:
  // "EastAsianLunisolarCalendar", "GregorianCalendar", "HebrewCalendar, "HijriCalendar",
  // "JapaneseCalendar", "JulianCalendar", "KoreanCalendar", "PersianCalendar",
  // "TaiwanCalendar", "ThaiBuddhistCalendar", "UmAlQuraCalendar"
  // In all cases they end in "Calendar" and RNL doesn't expect this, so we must truncate it.
  calendar = calendar.substr(0, calendar.size() - (ARRAYSIZE("Calendar") - 1));

  // Special edge case: RNL expects "buddhist" not "thaibuddhist"
  // see https://github.com/zoontek/react-native-localize/blob/master/src/types.ts
  if (calendar == "ThaiBuddhist")
  {
    return "buddhist";
  }

  std::transform(calendar.begin(), calendar.end(), calendar.begin(),
                 [](char c) {
                   return static_cast<char>(std::tolower(c));
                 });

  return calendar;
}

std::string RNLocalizeModule::getTimeZone()
{
  // Use GetTimeZoneInformation to get the hour bias from GMT and then create a formatted string.
  TIME_ZONE_INFORMATION TimeZoneInfo;
  if (GetTimeZoneInformation(&TimeZoneInfo) == TIME_ZONE_ID_INVALID)
  {
    return std::string();
  }
  int hourBias = -TimeZoneInfo.Bias / 60;
  char timeZoneBuffer[10];
  snprintf(
      timeZoneBuffer,
      sizeof(timeZoneBuffer),
      "UTC%s%02d:00",
      hourBias < 0 ? "-" : "+",
      hourBias < 0 ? -hourBias : hourBias);
  std::string timeZoneString(timeZoneBuffer);

  return timeZoneString;
}

NumberFormatSettings RNLocalizeModule::getNumberFormatSettings(std::string locale)
{
  NumberFormatSettings numberFormatSettings;

  // Use GetNumberFormatEx to get number formatting based on the passed locale.
  std::wstring num1000(L"1000.00");

  std::wstring wStrLocale = std::wstring(locale.begin(), locale.end());
  const int numberFormatBufferLength = 9;
  wchar_t numberFormatBuffer[numberFormatBufferLength];
  GetNumberFormatEx(wStrLocale.c_str(), 0, num1000.c_str(), nullptr, numberFormatBuffer, numberFormatBufferLength);
  std::string formattedString = winrt::to_string(numberFormatBuffer);

  // Note: The index is intentionally 5 because the output is expected to be something like "1,000.00" and not the original input of "1000.00"
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

} // namespace winrt::RNLocalize
