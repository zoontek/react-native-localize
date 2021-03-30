#pragma once

#include "JSValue.h"
#include "NativeModules.h"

using namespace winrt::Microsoft::ReactNative;

namespace winrt::ReactNativeLocalize
{

REACT_MODULE(RNLocalizeModule, L"ReactNativeLocalize");
struct RNLocalizeModule
{
    REACT_CONSTANT_PROVIDER(GetConstants)
    void RNLocalizeModule::GetConstants(RN::ReactConstantProvider &provider) noexcept;

    REACT_METHOD(initialConstants)
    LocalizationConstants initialConstants() noexcept;

private:
    std::vector<winrt::hstring> getLocaleNames();
    std::vector<Locale> getLocales(std::vector<winrt::hstring>);
    std::string getCountryCode(std::string);
    std::string getLanguageCode(std::string);
    bool getIsRTL(std::string);
    bool getUsesMetricSystem(std::string);
    std::string getTemperatureUnit(std::string);
    bool getUses24HourClock();
    std::vector<std::string> getCurrencies();
    std::string getScriptCode(winrt::hstring);
    std::string getCalendar();
    std::string getTimeZone();
    NumberFormatSettings getNumberFormatSettings(std::string);
    LocalizationConstants getExported();

    const std::array<std::string, 6> USES_FAHRENHEIT{{"BS", "BZ", "KY", "PR", "PW", "US"}};
    const std::array<std::string, 3> USES_IMPERIAL{{"LR", "MM", "US"}};
    const std::array<std::string, 11> USES_RTL_LAYOUT{
        {"ar", "ckb", "fa", "he", "ks", "lrc", "mzn", "ps", "ug", "ur", "yi"}};
};

} // namespace winrt::ReactNativeLocalize
