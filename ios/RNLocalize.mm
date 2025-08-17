#import "RNLocalize.h"

@implementation RNLocalize

RCT_EXPORT_MODULE();

// Internal

- (NSString * _Nullable)getCountryCodeForLocale:(NSLocale *)locale {
  NSString *countryCode = [locale countryCode];

  if ([countryCode isEqualToString:@"419"])
    return @"UN";

  return countryCode != nil ? [countryCode uppercaseString] : nil;
}

- (NSString * _Nullable)getCurrencyCodeForLocale:(NSLocale *)locale {
  NSString *currencyCode = [locale currencyCode];
  return currencyCode != nil ? [currencyCode uppercaseString] : nil;
}

- (NSString *)getLanguageTagForLanguageCode:(NSString *)languageCode
                                          scriptCode:(NSString * _Nullable)scriptCode
                                         countryCode:(NSString *)countryCode {
  NSString *languageTag = [languageCode copy];

  if (scriptCode != nil)
    languageTag = [languageTag stringByAppendingFormat:@"-%@", scriptCode];

  return [languageTag stringByAppendingFormat:@"-%@", countryCode];
}

// Implementation

- (NSString *)getCalendarImpl {
  NSLocale *currentLocale = [NSLocale currentLocale];
  NSString *calendar = [currentLocale calendarIdentifier];

  if ([calendar isEqualToString:NSCalendarIdentifierGregorian])
    return @"gregorian";
  if ([calendar isEqualToString:NSCalendarIdentifierBuddhist])
    return @"buddhist";
  if ([calendar isEqualToString:NSCalendarIdentifierCoptic])
    return @"coptic";
  if ([calendar isEqualToString:NSCalendarIdentifierEthiopicAmeteMihret])
    return @"ethiopic";
  if ([calendar isEqualToString:NSCalendarIdentifierEthiopicAmeteAlem])
    return @"ethiopic-amete-alem";
  if ([calendar isEqualToString:NSCalendarIdentifierHebrew])
    return @"hebrew";
  if ([calendar isEqualToString:NSCalendarIdentifierIndian])
    return @"indian";
  if ([calendar isEqualToString:NSCalendarIdentifierIslamic])
    return @"islamic";
  if ([calendar isEqualToString:NSCalendarIdentifierIslamicUmmAlQura])
    return @"islamic-umm-al-qura";
  if ([calendar isEqualToString:NSCalendarIdentifierIslamicCivil])
    return @"islamic-civil";
  if ([calendar isEqualToString:NSCalendarIdentifierIslamicTabular])
    return @"islamic-tabular";
  if ([calendar isEqualToString:NSCalendarIdentifierISO8601])
    return @"iso8601";
  if ([calendar isEqualToString:NSCalendarIdentifierJapanese])
    return @"japanese";
  if ([calendar isEqualToString:NSCalendarIdentifierPersian])
    return @"persian";

  return @"gregorian";
}

- (NSString *)getCountryImpl {
  NSLocale *currentLocale = [NSLocale currentLocale];
  NSString *currentCountryCode = [self getCountryCodeForLocale:currentLocale];

  if (currentCountryCode == nil)
    return @"US"; // Only happen in the simulator

  return currentCountryCode;
}

- (NSArray *)getCurrenciesImpl {
  NSMutableArray<NSString *> *currencies = [NSMutableArray array];
  NSString *currentCurrencyCode = [self getCurrencyCodeForLocale:[NSLocale currentLocale]];

  if (currentCurrencyCode != nil)
    [currencies addObject:currentCurrencyCode];

  for (NSString *identifier in [NSLocale preferredLanguages]) {
    NSLocale *systemLocale = [[NSLocale alloc] initWithLocaleIdentifier:identifier];
    NSString *currencyCode = [self getCurrencyCodeForLocale:systemLocale];

    if (currencyCode != nil && ![currencies containsObject:currencyCode])
      [currencies addObject:currencyCode];
  }

  if ([currencies count] == 0)
    [currencies addObject:@"USD"];

  return currencies;
}

- (NSArray *)getLocalesImpl {
  NSMutableArray<NSString *> *languageTags = [NSMutableArray array];
  NSMutableArray<NSDictionary *> *locales = [NSMutableArray array];

  for (NSString *identifier in [NSLocale preferredLanguages]) {
    NSLocale *systemLocale = [[NSLocale alloc] initWithLocaleIdentifier:identifier];

    NSString *languageCode = [[systemLocale languageCode] lowercaseString];
    NSString *scriptCode = [[systemLocale scriptCode] capitalizedString];
    NSString *countryCode = [self getCountryCodeForLocale:systemLocale];
    bool isRTL = [NSLocale characterDirectionForLanguage:[systemLocale localeIdentifier]] == NSLocaleLanguageDirectionRightToLeft;

    if (countryCode == nil)
      countryCode = [self getCountryImpl];

    NSString *languageTag = [self getLanguageTagForLanguageCode:languageCode
                                                     scriptCode:scriptCode
                                                    countryCode:countryCode];

    NSMutableDictionary *locale = [[NSMutableDictionary alloc] initWithDictionary:@{
      @"languageCode": languageCode,
      @"countryCode": countryCode,
      @"languageTag": languageTag,
      @"isRTL": @(isRTL),
    }];

    if (scriptCode != nil)
      [locale setObject:scriptCode forKey:@"scriptCode"];

    if (![languageTags containsObject:languageTag]) {
      [locales addObject:locale];
      [languageTags addObject:languageTag];
    }
  }

  return locales;
}

- (NSDictionary *)getNumberFormatSettingsImpl {
  NSLocale *currentLocale = [NSLocale currentLocale];

  return @{
    @"decimalSeparator": [currentLocale decimalSeparator],
    @"groupingSeparator": [currentLocale groupingSeparator],
  };
}

- (NSString *)getTemperatureUnitImpl {
  NSLocale *currentLocale = [NSLocale currentLocale];
  NSMeasurementFormatter *formatter = [NSMeasurementFormatter new];

  [formatter setLocale:currentLocale];

  NSMeasurement *temperature = [[NSMeasurement alloc] initWithDoubleValue:1.0 unit:[NSUnitTemperature celsius]];
  NSString *formatted = [formatter stringFromMeasurement:temperature];
  NSString *unitCharacter = [formatted substringFromIndex:[formatted length] - 1];

  return [unitCharacter isEqualToString:@"C"] ? @"celsius" : @"fahrenheit";
}

- (NSString *)getTimeZoneImpl {
  return [[NSTimeZone localTimeZone] name];
}

- (bool)uses24HourClockImpl {
  NSLocale *currentLocale = [NSLocale currentLocale];
  NSDateFormatter* formatter = [NSDateFormatter new];

  [formatter setLocale:currentLocale];
  [formatter setTimeZone:[NSTimeZone timeZoneForSecondsFromGMT:0]];
  [formatter setDateStyle:NSDateFormatterNoStyle];
  [formatter setTimeStyle:NSDateFormatterShortStyle];

  NSDate *date = [NSDate dateWithTimeIntervalSince1970:72000];
  return [[formatter stringFromDate:date] containsString:@"20"];
}

- (bool)usesMetricSystemImpl {
  NSLocale *currentLocale = [NSLocale currentLocale];
  return [currentLocale usesMetricSystem];
}

RCT_EXPORT_METHOD(openAppLanguageSettings:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
  reject(@"unsupported", @"openAppLanguageSettings is supported only on Android 13+", nil);
}

#ifdef RCT_NEW_ARCH_ENABLED

// New architecture

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeRNLocalizeSpecJSI>(params);
}

- (NSString *)getCalendar {
  return [self getCalendarImpl];
}

- (NSString *)getCountry {
  return [self getCountryImpl];
}

- (NSArray<NSString *> *)getCurrencies {
  return [self getCurrenciesImpl];
}

- (NSArray<NSDictionary *> *)getLocales {
  return [self getLocalesImpl];
}

- (NSDictionary *)getNumberFormatSettings {
  return [self getNumberFormatSettingsImpl];
}

- (NSString *)getTemperatureUnit {
  return [self getTemperatureUnitImpl];
}

- (NSString *)getTimeZone {
  return [self getTimeZoneImpl];
}

- (NSNumber *)uses24HourClock {
  return @([self uses24HourClockImpl]);
}

- (NSNumber *)usesMetricSystem {
  return @([self usesMetricSystemImpl]);
}

- (NSNumber * _Nullable)usesAutoDateAndTime {
  return nil;
}

- (NSNumber * _Nullable)usesAutoTimeZone {
  return nil;
}

#else

// Old architecture

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getCalendar) {
  return [self getCalendarImpl];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getCountry) {
  return [self getCountryImpl];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getCurrencies) {
  return [self getCurrenciesImpl];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getLocales) {
  return [self getLocalesImpl];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getNumberFormatSettings) {
  return [self getNumberFormatSettingsImpl];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getTemperatureUnit) {
  return [self getTemperatureUnitImpl];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getTimeZone) {
  return [self getTimeZoneImpl];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(uses24HourClock) {
  return @([self uses24HourClockImpl]);
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(usesMetricSystem) {
  return @([self usesMetricSystemImpl]);
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(usesAutoDateAndTime) {
  return nil;
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(usesAutoTimeZone) {
  return nil;
}

#endif

@end
