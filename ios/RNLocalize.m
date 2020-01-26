#import "RNLocalize.h"

@implementation RNLocalize

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

- (NSString * _Nonnull)calendarForLocale:(NSLocale * _Nonnull)locale {
  NSString *calendar = [[locale objectForKey:NSLocaleCalendar] calendarIdentifier];

  if ([calendar isEqualToString:NSCalendarIdentifierJapanese])
    return @"japanese";
  if ([calendar isEqualToString:NSCalendarIdentifierBuddhist])
    return @"buddhist";

  return @"gregorian";
}

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

- (NSDictionary * _Nonnull)numberFormatSettingsForLocale:(NSLocale * _Nonnull)locale {
  return @{
    @"decimalSeparator": [locale objectForKey:NSLocaleDecimalSeparator],
    @"groupingSeparator": [locale objectForKey:NSLocaleGroupingSeparator],
  };
}

- (NSString * _Nonnull)temperatureUnitForLocale:(NSLocale * _Nonnull)locale
                                    countryCode:(NSString * _Nonnull)countryCode {
  if (@available(iOS 10.0, tvOS 10.0, *)) {
    NSMeasurementFormatter *formatter = [NSMeasurementFormatter new];
    [formatter setLocale:locale];

    NSMeasurement *temperature = [[NSMeasurement alloc] initWithDoubleValue:42.0 unit:[NSUnitTemperature celsius]];
    NSString *formatted = [formatter stringFromMeasurement:temperature];
    NSString *unitCharacter = [formatted substringFromIndex:[formatted length] - 1];

    if ([unitCharacter isEqualToString:@"C"])
      return @"celsius";
    if ([unitCharacter isEqualToString:@"F"])
      return @"fahrenheit";
  }

  NSArray<NSString *> *usesFahrenheit = @[@"BS", @"BZ", @"KY", @"PR", @"PW", @"US"];
  return [usesFahrenheit containsObject:countryCode] ? @"fahrenheit" : @"celsius";
}

- (bool)uses24HourClockForLocale:(NSLocale * _Nonnull)locale {
  NSDateFormatter* formatter = [NSDateFormatter new];

  [formatter setLocale:locale];
  [formatter setTimeZone:[NSTimeZone timeZoneForSecondsFromGMT:0]];
  [formatter setDateStyle:NSDateFormatterNoStyle];
  [formatter setTimeStyle:NSDateFormatterShortStyle];

  NSDate *date = [NSDate dateWithTimeIntervalSince1970:72000];
  return [[formatter stringFromDate:date] containsString:@"20"];
}

- (bool)usesMetricSystemForLocale:(NSLocale * _Nonnull)locale {
  return [[locale objectForKey:NSLocaleUsesMetricSystem] boolValue];
}

- (NSDictionary * _Nonnull)exportedConstants {
  NSLocale *currentLocale = [NSLocale currentLocale];
  NSString *currentCountryCode = [self countryCodeForLocale:currentLocale];
  NSString *currentCurrencyCode = [self currencyCodeForLocale:currentLocale];

  if (currentCountryCode == nil)
    currentCountryCode = @"US"; // only happen in the simulator

  NSMutableArray<NSString *> *languageTags = [NSMutableArray array];
  NSMutableArray<NSDictionary *> *locales = [NSMutableArray array];
  NSMutableArray<NSString *> *currencies = [NSMutableArray array];

  if (currentCurrencyCode != nil)
    [currencies addObject:currentCurrencyCode];

  for (NSString *identifier in [NSLocale preferredLanguages]) {
    NSLocale *deviceLocale = [[NSLocale alloc] initWithLocaleIdentifier:identifier];
    NSString *deviceLanguageCode = [deviceLocale objectForKey:NSLocaleLanguageCode];

    NSString *languageCode = [deviceLanguageCode lowercaseString];
    NSString *scriptCode = [deviceLocale objectForKey:NSLocaleScriptCode];
    NSString *countryCode = [self countryCodeForLocale:deviceLocale];
    NSString *currencyCode = [self currencyCodeForLocale:deviceLocale];
    bool isRTL = [NSLocale characterDirectionForLanguage:languageCode] == NSLocaleLanguageDirectionRightToLeft;

    if (countryCode == nil)
      countryCode = currentCountryCode;

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

    if (currencyCode != nil && ![currencies containsObject:currencyCode])
      [currencies addObject:currencyCode];
  }

  if ([currencies count] == 0)
    [currencies addObject:@"USD"];

  return @{
    @"calendar": [self calendarForLocale:currentLocale],
    @"country": currentCountryCode,
    @"currencies": currencies,
    @"locales": locales,
    @"numberFormatSettings": [self numberFormatSettingsForLocale:currentLocale],
    @"temperatureUnit": [self temperatureUnitForLocale:currentLocale countryCode:currentCountryCode],
    @"timeZone": [[NSTimeZone localTimeZone] name],
    @"uses24HourClock": @([self uses24HourClockForLocale:currentLocale]),
    @"usesMetricSystem": @([self usesMetricSystemForLocale:currentLocale]),
  };
}

- (void)startObserving {
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(onLocalizationDidChange)
                                               name:NSCurrentLocaleDidChangeNotification
                                             object:nil];

  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(onLocalizationDidChange)
                                               name:NSSystemTimeZoneDidChangeNotification
                                             object:nil];

  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(onLocalizationDidChange)
                                               name:NSSystemClockDidChangeNotification
                                             object:nil];
}

- (void)stopObserving {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (NSDictionary *)constantsToExport {
  return @{ @"initialConstants": [self exportedConstants] };
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"localizationDidChange"];
}

- (void)onLocalizationDidChange {
  [self sendEventWithName:@"localizationDidChange" body:[self exportedConstants]];
}

@end
