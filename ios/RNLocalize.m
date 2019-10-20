#import "RNLocalize.h"

static NSString * _Nonnull getCalendar(NSLocale * _Nonnull locale) {
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

static NSString * _Nullable getCountryCode(NSLocale * _Nonnull locale) {
  NSString *countryCode = [locale objectForKey:NSLocaleCountryCode];

  if ([countryCode isEqualToString:@"419"]) {
    return @"UN";
  }

  return countryCode;
}

static NSString * _Nonnull createLanguageTag(NSString * _Nonnull languageCode,
                                             NSString * _Nullable scriptCode,
                                             NSString * _Nonnull countryCode) {
  NSString *languageTag = [languageCode copy];

  if (scriptCode != nil) {
    languageTag = [languageTag stringByAppendingFormat:@"-%@", scriptCode];
  }

  return [languageTag stringByAppendingFormat:@"-%@", countryCode];
}

static NSString * _Nonnull getTemperatureUnit(NSLocale * _Nonnull locale, NSString * _Nonnull countryCode) {
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

static bool getUses24HourClock(NSLocale * _Nonnull locale) {
  NSDateFormatter* formatter = [NSDateFormatter new];
  [formatter setLocale:locale];
  [formatter setTimeZone:[NSTimeZone timeZoneForSecondsFromGMT:0]];
  [formatter setDateStyle:NSDateFormatterNoStyle];
  [formatter setTimeStyle:NSDateFormatterShortStyle];

  NSDate *date = [NSDate dateWithTimeIntervalSince1970:72000];
  return [[formatter stringFromDate:date] containsString:@"20"];
}

static bool getUsesMetricSystem(NSLocale * _Nonnull locale) {
  return [[locale objectForKey:NSLocaleUsesMetricSystem] boolValue];
}

static NSDictionary * _Nonnull getNumberFormatSettings(NSLocale * _Nonnull locale) {
  return @{
           @"decimalSeparator": [locale objectForKey:NSLocaleDecimalSeparator],
           @"groupingSeparator": [locale objectForKey:NSLocaleGroupingSeparator],
           };
}

static NSDictionary * _Nonnull getExported() {
  NSLocale *currentLocale = [NSLocale autoupdatingCurrentLocale];
  NSString *currentCountryCode = getCountryCode(currentLocale);
  NSString *currentCurrency = [currentLocale objectForKey:NSLocaleCurrencyCode];

  if (currentCountryCode == nil) {
    currentCountryCode = @"US"; // only happen in the simulator
  }

  NSMutableArray<NSString *> *languageTagsList = [NSMutableArray array];
  NSMutableArray<NSDictionary *> *locales = [NSMutableArray array];
  NSMutableArray<NSString *> *currencies = [NSMutableArray array];

  if (currentCurrency != nil) {
    [currencies addObject:currentCurrency];
  }

  for (NSString *identifier in [NSLocale preferredLanguages]) {
    NSLocale *deviceLocale = [[NSLocale alloc] initWithLocaleIdentifier:identifier];

    NSString *languageCode = [deviceLocale objectForKey:NSLocaleLanguageCode];
    NSString *scriptCode = [deviceLocale objectForKey:NSLocaleScriptCode];
    NSString *countryCode = getCountryCode(deviceLocale);
    NSString *currencyCode = [deviceLocale objectForKey:NSLocaleCurrencyCode];
    bool isRTL = [NSLocale characterDirectionForLanguage:languageCode] == NSLocaleLanguageDirectionRightToLeft;

    if (countryCode == nil) {
      countryCode = currentCountryCode;
    }

    NSString *languageTag = createLanguageTag(languageCode, scriptCode, countryCode);

    NSMutableDictionary *locale = [[NSMutableDictionary alloc] initWithDictionary:@{
                                                                                    @"languageCode": languageCode,
                                                                                    @"countryCode": countryCode,
                                                                                    @"languageTag": languageTag,
                                                                                    @"isRTL": @(isRTL),
                                                                                    }];

    if (scriptCode != nil) {
      [locale setObject:scriptCode forKey:@"scriptCode"];
    }

    if (![languageTagsList containsObject:languageTag]) {
      [languageTagsList addObject:languageTag];
      [locales addObject:locale];
    }

    if (currencyCode != nil && ![currencies containsObject:currencyCode]) {
      [currencies addObject:currencyCode];
    }
  }

  if ([currencies count] == 0) {
    [currencies addObject:@"USD"];
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
