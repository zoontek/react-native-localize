#import "RNLanguages.h"
#import <UIKit/UIKit.h>

@implementation RNLanguages

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

- (NSMutableArray *)ensureLanguageTags:(NSArray *)languages
{
  NSMutableArray *sanitizedLanguages = [NSMutableArray array];

  for (id language in languages) {
    [sanitizedLanguages addObject:[language stringByReplacingOccurrencesOfString:@"_" withString:@"-"]];
  }

  return sanitizedLanguages;
}

- (NSDictionary *)constantsToExport
{
  NSArray *preferredLanguages = [[[UIDevice currentDevice] systemVersion] floatValue] >= 9
    ? [NSLocale preferredLanguages]
    : [self ensureLanguageTags:[NSLocale preferredLanguages]];

  return @{
    @"language": [preferredLanguages objectAtIndex:0],
    @"languages": preferredLanguages
  };
}

@end
