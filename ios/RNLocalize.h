#ifdef RCT_NEW_ARCH_ENABLED

#import <RNLocalizeSpec/RNLocalizeSpec.h>
@interface RNLocalize : NSObject <NativeRNLocalizeSpec>

#else

#import <React/RCTBridgeModule.h>
@interface RNLocalize : NSObject <RCTBridgeModule>

#endif

@end
