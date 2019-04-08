#import "RNLocalize.h"

static NSString *getCalendar(NSLocale *locale) {
  static dispatch_once_t onceToken;
  static NSDictionary *calendars;

  dispatch_once(&onceToken, ^{
    calendars = @{
                  NSCalendarIdentifierGregorian: @"gregorian",
                  NSCalendarIdentifierJapanese: @"japanese",
                  NSCalendarIdentifierBuddhist: @"buddhist",
                  };
  });

  NSString *calendar = [[locale objectForKey:NSLocaleCalendar] calendarIdentifier];

  if (calendar == nil || [calendars objectForKey:calendar] == nil) {
    calendar = [calendars objectForKey:NSCalendarIdentifierGregorian];
  }

  return calendar;
}

static NSString *getCountryCode(NSLocale *locale, NSString *fallback) {
  NSString *countryCode = [locale objectForKey:NSLocaleCountryCode];
  return countryCode != nil ? countryCode : fallback;
}

static NSString *getCurrencyCode(NSLocale *locale, NSString *fallback) {
  NSString *currencyCode = [locale objectForKey:NSLocaleCurrencyCode];
  return currencyCode != nil ? currencyCode : fallback;
}

static NSString *getTemperatureUnit(NSLocale *locale, NSString *countryCode) {
  static dispatch_once_t onceToken;
  static NSArray<NSString *> *usesFahrenheit;
  static NSDictionary *temperatureUnits;

  dispatch_once(&onceToken, ^{
    usesFahrenheit = @[@"BS", @"BZ", @"KY", @"PR", @"PW", @"US"];

    temperatureUnits = @{
                         @"C": @"celsius",
                         @"F": @"fahrenheit",
                         };
  });

  if (@available(iOS 10.0, tvOS 10.0, *)) {
    NSMeasurementFormatter *formatter = [NSMeasurementFormatter new];
    [formatter setLocale:locale];

    NSMeasurement *temperature = [[NSMeasurement alloc] initWithDoubleValue:42.0 unit:[NSUnitTemperature celsius]];
    NSString *formatted = [formatter stringFromMeasurement:temperature];
    NSString *lastChar = [formatted substringFromIndex:[formatted length] - 1];
    NSString *temperatureUnit = [temperatureUnits objectForKey:lastChar];

    if (temperatureUnit != nil) {
      return temperatureUnit;
    }
  }

  return [temperatureUnits objectForKey:([usesFahrenheit containsObject:countryCode] ? @"F" : @"C")];
}

static bool getUses24HourClock(NSLocale *locale) {
  NSDateFormatter* formatter = [NSDateFormatter new];
  [formatter setLocale:locale];
  [formatter setTimeZone:[NSTimeZone timeZoneForSecondsFromGMT:0]];
  [formatter setDateStyle:NSDateFormatterNoStyle];
  [formatter setTimeStyle:NSDateFormatterShortStyle];

  NSDate *date = [NSDate dateWithTimeIntervalSince1970:72000];
  return [[formatter stringFromDate:date] containsString:@"20"];
}

static bool getUsesMetricSystem(NSLocale *locale) {
  return [[locale objectForKey:NSLocaleUsesMetricSystem] boolValue];
}

static NSDictionary *getNumberFormatSettings(NSLocale *locale) {
  return @{
           @"decimalSeparator": [locale objectForKey:NSLocaleDecimalSeparator],
           @"groupingSeparator": [locale objectForKey:NSLocaleGroupingSeparator],
           };
}

static NSDictionary *getExported() {
  NSLocale *currentLocale = [NSLocale autoupdatingCurrentLocale];
  NSString *currentCountryCode = getCountryCode(currentLocale, @"US");

  NSMutableArray<NSDictionary *> *locales = [NSMutableArray array];
  NSMutableArray<NSString *> *currencies = [NSMutableArray array];

  [currencies addObject:getCurrencyCode(currentLocale, @"USD")];

  for (NSString *identifier in [NSLocale preferredLanguages]) {
    NSLocale *locale = [[NSLocale alloc] initWithLocaleIdentifier:identifier];
    NSString *languageCode = [locale objectForKey:NSLocaleLanguageCode];
    NSString *scriptCode = [locale objectForKey:NSLocaleScriptCode];
    NSString *countryCode = getCountryCode(locale, currentCountryCode);
    NSString *currencyCode = getCurrencyCode(locale, @"USD");
    bool isRTL = [NSLocale characterDirectionForLanguage:languageCode] == NSLocaleLanguageDirectionRightToLeft;

    if (![currencies containsObject:currencyCode]) {
      [currencies addObject:currencyCode];
    }

    NSMutableDictionary *result = [[NSMutableDictionary alloc] initWithDictionary:@{
                                                                                    @"languageCode": languageCode,
                                                                                    @"countryCode": countryCode,
                                                                                    @"isRTL": @(isRTL),
                                                                                    }];

    NSString *languageTag = [languageCode copy];

    if (scriptCode != nil) {
      languageTag = [languageTag stringByAppendingFormat:@"-%@", scriptCode];
      [result setObject:scriptCode forKey:@"scriptCode"];
    }

    languageTag = [languageTag stringByAppendingFormat:@"-%@", countryCode];
    [result setObject:languageTag forKey:@"languageTag"];

    [locales addObject:result];
  }

  return @{
           @"calendar": getCalendar(currentLocale),
           @"country": currentCountryCode,
           @"currencies": currencies,
           @"locales": locales,
           @"numberFormatSettings": getNumberFormatSettings(currentLocale),
           @"temperatureUnit": getTemperatureUnit(currentLocale, currentCountryCode),
           @"timeZone": [[NSTimeZone localTimeZone] name],
           @"uses24HourClock": @(getUses24HourClock(currentLocale)),
           @"usesMetricSystem": @(getUsesMetricSystem(currentLocale)),
           };
}

@implementation RNLocalize

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup {
  return NO;
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
}

- (void)stopObserving {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (NSDictionary *)constantsToExport {
  return @{ @"initialConstants": getExported() };
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"localizationDidChange"];
}

- (void)onLocalizationDidChange {
  [self sendEventWithName:@"localizationDidChange" body:getExported()];
}

@end
