#import "RNLocalize.h"

@implementation RNLocalize

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

// Internal

- (NSString * _Nullable)countryCodeForLocale:(NSLocale * _Nonnull)locale {
  NSString *countryCode = [locale objectForKey:NSLocaleCountryCode];

  if ([countryCode isEqualToString:@"419"])
    return @"UN";

  return countryCode != nil ? [countryCode uppercaseString] : nil;
}

- (NSString * _Nullable)currencyCodeForLocale:(NSLocale * _Nonnull)locale {
  NSString *currencyCode = [locale objectForKey:NSLocaleCurrencyCode];
  return currencyCode != nil ? [currencyCode uppercaseString] : nil;
}

- (NSString * _Nonnull)languageTagForLanguageCode:(NSString * _Nonnull)languageCode
                                       scriptCode:(NSString * _Nullable)scriptCode
                                      countryCode:(NSString * _Nonnull)countryCode {
  NSString *languageTag = [languageCode copy];

  if (scriptCode != nil)
    languageTag = [languageTag stringByAppendingFormat:@"-%@", scriptCode];

  return [languageTag stringByAppendingFormat:@"-%@", countryCode];
}

// Implementation

- (NSString * _Nonnull)currentCalendar {
  NSLocale *currentLocale = [NSLocale currentLocale];
  NSString *calendar = [[currentLocale objectForKey:NSLocaleCalendar] calendarIdentifier];

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

- (NSString * _Nonnull)currentCountryCode {
  NSLocale *currentLocale = [NSLocale currentLocale];
  NSString *currentCountryCode = [self countryCodeForLocale:currentLocale];

  if (currentCountryCode == nil)
    return @"US"; // only happen in the simulator

  return currentCountryCode;
}

- (NSArray * _Nonnull)currentCurrencies {
  NSMutableArray<NSString *> *currencies = [NSMutableArray array];
  NSString *currentCurrencyCode = [self currencyCodeForLocale:[NSLocale currentLocale]];

  if (currentCurrencyCode != nil)
    [currencies addObject:currentCurrencyCode];

  for (NSString *identifier in [NSLocale preferredLanguages]) {
    NSLocale *systemLocale = [[NSLocale alloc] initWithLocaleIdentifier:identifier];
    NSString *currencyCode = [self currencyCodeForLocale:systemLocale];

    if (currencyCode != nil && ![currencies containsObject:currencyCode])
      [currencies addObject:currencyCode];
  }

  if ([currencies count] == 0)
    [currencies addObject:@"USD"];

  return currencies;
}

- (NSArray * _Nonnull)currentLocales {
  NSMutableArray<NSString *> *languageTags = [NSMutableArray array];
  NSMutableArray<NSDictionary *> *locales = [NSMutableArray array];

  for (NSString *identifier in [NSLocale preferredLanguages]) {
    NSLocale *systemLocale = [[NSLocale alloc] initWithLocaleIdentifier:identifier];
    NSString *systemLanguageCode = [systemLocale objectForKey:NSLocaleLanguageCode];

    NSString *languageCode = [systemLanguageCode lowercaseString];
    NSString *scriptCode = [systemLocale objectForKey:NSLocaleScriptCode];
    NSString *countryCode = [self countryCodeForLocale:systemLocale];
    bool isRTL = [NSLocale characterDirectionForLanguage:languageCode] == NSLocaleLanguageDirectionRightToLeft;

    if (countryCode == nil)
      countryCode = [self currentCountryCode];

    NSString *languageTag = [self languageTagForLanguageCode:languageCode
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

- (NSDictionary * _Nonnull)currentNumberFormatSettings {
  NSLocale *currentLocale = [NSLocale currentLocale];

  return @{
    @"decimalSeparator": [currentLocale objectForKey:NSLocaleDecimalSeparator],
    @"groupingSeparator": [currentLocale objectForKey:NSLocaleGroupingSeparator],
  };
}

- (NSString * _Nonnull)currentTemperatureUnit {
  NSLocale *currentLocale = [NSLocale currentLocale];
  NSMeasurementFormatter *formatter = [NSMeasurementFormatter new];

  [formatter setLocale:currentLocale];

  NSMeasurement *temperature = [[NSMeasurement alloc] initWithDoubleValue:42.0 unit:[NSUnitTemperature celsius]];
  NSString *formatted = [formatter stringFromMeasurement:temperature];
  NSString *unitCharacter = [formatted substringFromIndex:[formatted length] - 1];

  return [unitCharacter isEqualToString:@"C"] ? @"celsius" : @"fahrenheit";
}

- (NSString * _Nonnull)currentTimeZone {
  return [[NSTimeZone localTimeZone] name];
}

- (bool)currentUses24HourClock {
  NSLocale *currentLocale = [NSLocale currentLocale];
  NSDateFormatter* formatter = [NSDateFormatter new];

  [formatter setLocale:currentLocale];
  [formatter setTimeZone:[NSTimeZone timeZoneForSecondsFromGMT:0]];
  [formatter setDateStyle:NSDateFormatterNoStyle];
  [formatter setTimeStyle:NSDateFormatterShortStyle];

  NSDate *date = [NSDate dateWithTimeIntervalSince1970:72000];
  return [[formatter stringFromDate:date] containsString:@"20"];
}

- (bool)currentUsesMetricSystem {
  NSLocale *currentLocale = [NSLocale currentLocale];
  return [[currentLocale objectForKey:NSLocaleUsesMetricSystem] boolValue];
}

// Exposed

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getCalendar) {
  return [self currentCalendar];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getCountry) {
  return [self currentCountryCode];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getCurrencies) {
  return [self currentCurrencies];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getLocales) {
  return [self currentLocales];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getNumberFormatSettings) {
  return [self currentNumberFormatSettings];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getTemperatureUnit) {
  return [self currentTemperatureUnit];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getTimeZone) {
  return [self currentTimeZone];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(uses24HourClock) {
  return @([self currentUses24HourClock]);
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(usesAutoDateAndTime) {
  return nil;
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(usesAutoTimeZone) {
  return nil;
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(usesMetricSystem) {
  return @([self currentUsesMetricSystem]);
}

@end
