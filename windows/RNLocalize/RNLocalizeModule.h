#pragma once

#include "JSValue.h"
#include "NativeModules.h"
#include "RNLocalizeModuleTypes.h"
#include <vector>

using namespace winrt::Microsoft::ReactNative;

namespace winrt::RNLocalize
{

REACT_MODULE(RNLocalizeModule, L"RNLocalize");
struct RNLocalizeModule
{
    REACT_CONSTANT_PROVIDER(GetConstants)
    void RNLocalizeModule::GetConstants(winrt::Microsoft::ReactNative::ReactConstantProvider &provider) noexcept;

    REACT_METHOD(initialConstants)
    LocalizationConstants initialConstants() noexcept;

private:
    std::vector<winrt::hstring> getLocaleNames();
    std::vector<Locale> getLocales(std::vector<winrt::hstring>);
    std::string getCountryCode(std::string);
    std::string getLanguageCode(std::string);
    bool getIsRTL(winrt::Windows::Globalization::LanguageLayoutDirection);
    bool getUsesMetricSystem(std::string);
    std::string getTemperatureUnit(std::string);
    bool getUses24HourClock();
    std::vector<std::string> getCurrencies();
    std::string getScriptCode(winrt::hstring);
    std::string getCalendar();
    std::string getTimeZone();
    NumberFormatSettings getNumberFormatSettings(std::string);
    LocalizationConstants getExported();

    const static std::array<std::string, 6> USES_FAHRENHEIT;
    const static std::array<std::string, 3> USES_IMPERIAL;
};

} // namespace winrt::RNLocalize
