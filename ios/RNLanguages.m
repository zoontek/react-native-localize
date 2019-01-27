#import "RNLanguages.h"

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

static NSString *getLanguageCode(NSLocale *locale) {
  return [locale objectForKey:NSLocaleLanguageCode];
}

static NSString *getScriptCode(NSLocale *locale) {
  NSString *scriptCode = [locale objectForKey:NSLocaleScriptCode];
  return scriptCode != nil ? scriptCode : @"";
}

static NSString *getCountryCode(NSLocale *locale, NSString *fallback) {
  NSString *countryCode = [locale objectForKey:NSLocaleCountryCode];
  return countryCode != nil ? countryCode : fallback;
}

static NSString *getCurrencyCode(NSLocale *locale, NSString *fallback) {
  NSString *currencyCode = [locale objectForKey:NSLocaleCurrencyCode];
  return currencyCode != nil ? currencyCode : fallback;
}

static bool getIsRTL(NSString *languageCode) {
  return [NSLocale characterDirectionForLanguage:languageCode] == NSLocaleLanguageDirectionRightToLeft;
}

static NSString *concatCodes(NSString *code1, NSString *code2) {
  return [code1 stringByAppendingFormat:([code2 isEqualToString:@""] ? @"%@" : @"-%@"), code2];
}

static NSString *getTemperatureUnit(NSLocale *locale, NSString *countryCode) {
  static dispatch_once_t onceToken;
  static NSArray<NSString *> *usesFahrenheit;
  static NSDictionary *temperatureUnits;

  dispatch_once(&onceToken, ^{
    usesFahrenheit = @[@"BS", @"BZ", @"KY", @"PR", @"PW", @"US"];

    temperatureUnits = @{
                         @"C": @"°C",
                         @"F": @"°F",
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

static NSDictionary *getConfig() {
  NSMutableArray<NSDictionary *> *languages = [NSMutableArray array];
  NSMutableArray<NSString *> *currencies = [NSMutableArray array];
  NSMutableArray<NSDictionary *> *extracteds = [NSMutableArray array];
  NSMutableArray<NSString *> *fallbacks = [NSMutableArray array];

  NSLocale *currentLocale = [NSLocale autoupdatingCurrentLocale];
  NSString *currentCountryCode = getCountryCode(currentLocale, @"US");

  [currencies addObject:getCurrencyCode(currentLocale, @"USD")];

  for (NSString *identifier in [NSLocale preferredLanguages]) {
    NSLocale *locale = [[NSLocale alloc] initWithLocaleIdentifier:identifier];

    NSString *languageCode = getLanguageCode(locale);
    NSString *partialCode = concatCodes(languageCode, getScriptCode(locale));
    NSString *currencyCode = getCurrencyCode(locale, @"USD");
    NSString *countryCode = getCountryCode(locale, currentCountryCode);

    if (![currencies containsObject:currencyCode]) {
      [currencies addObject:currencyCode];
    }

    [extracteds addObject:@{
                            @"languageCode": languageCode,
                            @"partialCode": partialCode,
                            @"fullCode": concatCodes(partialCode, countryCode),
                            }];
  }

  long extractedsCount = [extracteds count];

  for (long i = 0; i < extractedsCount; i++) {
    NSDictionary *extracted = [extracteds objectAtIndex:i];
    NSString *languageCode = [extracted objectForKey:@"languageCode"];
    NSString *partialCode = [extracted objectForKey:@"partialCode"];
    bool isRTL = getIsRTL(languageCode);

    [languages addObject:@{
                           @"code": [extracted objectForKey:@"fullCode"],
                           @"isRTL": @(isRTL),
                           @"isFallback": @((bool)0),
                           }];

    NSString *nextLanguageCode = nil;
    NSString *nextPartialCode = nil;

    if (i + 1 < extractedsCount) {
      nextLanguageCode = [[extracteds objectAtIndex:i + 1] objectForKey:@"languageCode"];
      nextPartialCode = [[extracteds objectAtIndex:i + 1] objectForKey:@"partialCode"];
    }

    if (![partialCode isEqualToString:languageCode]) {
      if ([partialCode isEqualToString:nextPartialCode]) {
        continue;
      }

      if (![fallbacks containsObject:partialCode]) {
        [fallbacks addObject:partialCode];

        [languages addObject:@{
                               @"code": partialCode,
                               @"isRTL": @(isRTL),
                               @"isFallback": @((bool)1),
                               }];
      }
    }

    if (![languageCode isEqualToString:nextPartialCode] && ![languageCode isEqualToString:nextLanguageCode]) {
      if (![fallbacks containsObject:languageCode]) {
        [fallbacks addObject:languageCode];

        [languages addObject:@{
                               @"code": languageCode,
                               @"isRTL": @(isRTL),
                               @"isFallback": @((bool)1),
                               }];
      }
    }
  }

  return @{
           @"languages": languages,
           @"currencies": currencies,
           @"calendar": getCalendar(currentLocale),
           @"country": currentCountryCode,
           @"temperatureUnit": getTemperatureUnit(currentLocale, currentCountryCode),
           @"timeZone": [[NSTimeZone localTimeZone] name],
           @"uses24HourClock": @(getUses24HourClock(currentLocale)),
           @"usesMetricSystem": @(getUsesMetricSystem(currentLocale)),
           };
}

@implementation RNLanguages

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

- (void)startObserving {
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(onLanguagesConfigDidChange)
                                               name:NSCurrentLocaleDidChangeNotification
                                             object:nil];
}

- (void)stopObserving {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (NSDictionary *)constantsToExport {
  return @{ @"config": getConfig() };
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"languagesConfigDidChange"];
}

- (void)onLanguagesConfigDidChange {
  [self sendEventWithName:@"languagesConfigDidChange" body:getConfig()];
}

@end
